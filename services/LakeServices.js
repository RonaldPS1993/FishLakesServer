import {
  getNearbyLakesFromDB,
  getLakeById,
  getCachedLake,
  createCachedLake,
  setFavoriteLake,
  removeFavoriteLake,
  getFavoriteLake,
} from "../modules/LakeModules.js";
import { GOOGLE_PLACES_API_KEY } from "../config/index.js";
import {
  successResponse,
  errorResponse,
  getErrorMessage,
  ErrorCode,
} from "../utils/index.js";

/**
 * Fetches photo and extract from Wikipedia for a lake
 * @param {string} lakeName - Name of the lake
 * @returns {Promise<object>} { photo_url, about }
 */
const fetchWikipediaData = async (lakeName) => {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: lakeName,
      prop: "pageimages|extracts",
      exintro: "true",
      explaintext: "true",
      piprop: "original",
      format: "json",
      origin: "*",
    });
    const url = `https://en.wikipedia.org/w/api.php?${params}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "FishLakeApp/1.0 (contact@fishlake.app)" },
    });
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return { photo_url: "", about: "" };
    const page = Object.values(pages)[0];
    if (page.missing !== undefined) return { photo_url: "", about: "" };
    return {
      photo_url: page.original?.source || page.thumbnail?.source || "",
      about: (page.extract || "").substring(0, 500),
    };
  } catch (err) {
    console.error("Wikipedia fetch error:", err);
    return { photo_url: "", about: "" };
  }
};

/**
 * Fetches photo from Google Places as fallback
 * @param {string} lakeName - Name of the lake
 * @returns {Promise<string|null>} Photo URL or null
 */
const fetchGooglePlacesPhoto = async (lakeName) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) return null;
    const searchUrl = "https://places.googleapis.com/v1/places:searchText";
    const searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.photos",
      },
      body: JSON.stringify({ textQuery: lakeName, maxResultCount: 1 }),
    });
    const searchData = await searchResponse.json();
    const photoRef = searchData.places?.[0]?.photos?.[0]?.name;
    if (!photoRef) return null;
    return `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=800&key=${GOOGLE_PLACES_API_KEY}`;
  } catch (err) {
    console.error("Google Places fetch error:", err);
    return null;
  }
};

/**
 * Gets nearby lakes using PostGIS RPC function
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<object>} Standardized response
 */
const getNearbyLakes = async (lat, lng, radius) => {
  try {
    const result = await getNearbyLakesFromDB(lat, lng, radius);
    return result;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Gets lake detail by HydroLakes ID with photo caching
 * Checks cache first, then fetches from hydrolakes + Wikipedia/Google Places
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response with lake detail + photo
 */
const getLakeDetail = async (hylakId) => {
  try {
    // Step 1: Check cache
    const cached = await getCachedLake(hylakId);
    if (cached.status === "Success" && cached.data) {
      // Merge cached data with hydrolakes data for full response
      const hydro = await getLakeById(hylakId);
      if (hydro.status === "Success") {
        const lakeResponse = {
          ...hydro.data,
          photo_url: cached.data.photo_url,
          photo_source: cached.data.photo_source,
          about: cached.data.about || "",
        };
        return successResponse("Lake detail", lakeResponse);
      }
      return cached;
    }

    // Step 2: Fetch from hydrolakes
    const hydro = await getLakeById(hylakId);
    if (hydro.status !== "Success") {
      return hydro;
    }

    // Step 3: Fetch photo (Wikipedia primary, Google Places fallback)
    const wikiData = await fetchWikipediaData(hydro.data.lake_name);
    let photoResult = {
      photo_url: wikiData.photo_url,
      photo_source: wikiData.photo_url ? "wikipedia" : "",
      about: wikiData.about,
    };

    if (!photoResult.photo_url) {
      const googlePhoto = await fetchGooglePlacesPhoto(hydro.data.lake_name);
      if (googlePhoto) {
        photoResult = {
          photo_url: googlePhoto,
          photo_source: "google_places",
          about: wikiData.about,
        };
      }
    }

    // Step 4: Build response
    const lakeResponse = { ...hydro.data, ...photoResult };

    // Step 5: Return response immediately
    const response = successResponse("Lake detail", lakeResponse);

    // Step 6: Fire async cache write (don't await)
    createCachedLake({
      hylak_id: hydro.data.hylak_id,
      lake_name: hydro.data.lake_name,
      photo_url: photoResult.photo_url || "",
      photo_source: photoResult.photo_source || "",
      about: photoResult.about || "",
    }).catch(err => console.error("Failed to cache lake:", err));

    return response;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Adds a lake as user's favorite
 * Ensures the lake exists in the cache table before setting favorite
 * @param {string} userId - Supabase auth user ID
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response
 */
const addFavorite = async (userId, hylakId) => {
  try {
    // Check if lake exists in cache
    let cached = await getCachedLake(hylakId);

    if (cached.status !== "Success" || !cached.data) {
      // Create minimal cache row from hydrolakes
      const hydro = await getLakeById(hylakId);
      if (hydro.status !== "Success") {
        return errorResponse("Lake not found", ErrorCode.NOT_FOUND);
      }

      await createCachedLake({
        hylak_id: hydro.data.hylak_id,
        lake_name: hydro.data.lake_name,
        photo_url: "",
        photo_source: "",
        about: "",
      });

      // Re-fetch to get the UUID
      cached = await getCachedLake(hylakId);
      if (cached.status !== "Success" || !cached.data) {
        return errorResponse("Failed to cache lake for favorite", ErrorCode.DATABASE_ERROR);
      }
    }

    // Set favorite using the lakes table UUID
    return await setFavoriteLake(userId, cached.data.id);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Removes user's favorite lake
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<object>} Standardized response
 */
const removeFavorite = async (userId) => {
  try {
    return await removeFavoriteLake(userId);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Gets user's favorite lake with full lake data
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<object>} Standardized response with lake data or null
 */
const getUserFavorite = async (userId) => {
  try {
    return await getFavoriteLake(userId);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

export { getNearbyLakes, getLakeDetail, addFavorite, removeFavorite, getUserFavorite };
