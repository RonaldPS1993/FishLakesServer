import { createLake, getLakeByName } from "../modules/LakeModules.js";
import { authenticateUser } from "../modules/UserModules.js";
import {
  successResponse,
  errorResponse,
  getErrorMessage,
  ErrorCode,
} from "../utils/index.js";
import { GOOGLE_MAPS_API_KEY } from "../config/index.js";

/**
 * Builds a lake payload from Google Places data
 * @param {object} placeData - Google Places API response item
 * @returns {object} Lake payload for database
 */
const buildLakePayload = (placeData) => {
  const displayName = placeData.displayName?.text || "";
  const addressParts = (placeData.formattedAddress || "").split(",");
  const searchName = displayName.toLowerCase().trim();

  return {
    location: placeData.location || null,
    name: displayName,
    searchName: searchName,
    country: addressParts[2]?.trim() || "",
    state: addressParts[1]?.trim() || "",
    createdAt: new Date(),
    placeId: placeData.id || "",
  };
};

/**
 * Fetches lake from Google Places API
 * @param {string} lakeName - Name to search for
 * @returns {Promise<object>} Standardized response
 */
const fetchLakeFromGooglePlaces = async (lakeName) => {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const requestBody = {
    textQuery: lakeName,
    maxResultCount: 5,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.id,places.types",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      return errorResponse(
        `Google Places API error: ${response.status}`,
        ErrorCode.EXTERNAL_API_ERROR,
      );
    }
    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return errorResponse(
        "No results found in Google Places",
        ErrorCode.NOT_FOUND,
      );
    }

    const lakePlace = data.places.find((place) =>
      place.types?.includes("natural_feature"),
    );

    if (!lakePlace) {
      return errorResponse(
        "No lake found matching the search",
        ErrorCode.NOT_FOUND,
      );
    }

    const payload = buildLakePayload(lakePlace);
    const newLake = await createLake(payload);

    return newLake;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.EXTERNAL_API_ERROR);
  }
};

/**
 * Searches for a lake by name
 * First checks database, then falls back to Google Places API
 * Requires admin authentication
 * @param {string} lakeName - Name of lake to search
 * @param {string} token - Firebase auth token
 * @returns {Promise<object>} Standardized response
 */
const searchLakeByName = async (lakeName, token) => {
  try {
    if (!lakeName || typeof lakeName !== "string" || !lakeName.trim()) {
      return errorResponse("Invalid lake name", ErrorCode.VALIDATION_ERROR);
    }

    const authResult = await authenticateUser(token);

    if (authResult.status !== "Success") {
      return errorResponse(
        "Authentication failed",
        ErrorCode.AUTHENTICATION_ERROR,
      );
    }

    if (authResult.data.role !== "admin") {
      return errorResponse(
        "Access denied. Admin role required.",
        ErrorCode.AUTHORIZATION_ERROR,
      );
    }

    const dbLake = await getLakeByName(lakeName);

    if (dbLake.status === "Success") {
      return dbLake;
    }

    if (dbLake.code === ErrorCode.NOT_FOUND) {
      return await fetchLakeFromGooglePlaces(lakeName);
    }

    return dbLake;
  } catch (error) {
    return errorResponse(getErrorMessage(error), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Gets nearby lakes by latitude and longitude
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @param {number} radius - Radius in meters
 * @returns {Promise<object>} Standardized response
 */
const getLakesByLocation = async (latitude, longitude, radius) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius}&` +
        `type=natural_feature&` +
        `keyword=lake&` +
        `key=${GOOGLE_MAPS_API_KEY}`,
    );

    const data = await response.json();

    if (data.status === "OK") {
      return successResponse("Nearby lakes fetched successfully", data.results);
    } else {
      return errorResponse(
        "Failed to fetch nearby lakes",
        ErrorCode.EXTERNAL_API_ERROR,
      );
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Gets nearby lakes by latitude and longitude
 * First checks database, then falls back to Google Places API
 * Requires admin authentication
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @param {number} radius - Radius in meters
 * @param {string} token - Firebase auth token
 * @returns {Promise<object>} Standardized response
 */
const getNearbyLakes = async (latitude, longitude, radius, token) => {
  try {
    if (
      !latitude ||
      typeof latitude !== "number" ||
      !longitude ||
      typeof longitude !== "number" ||
      !radius ||
      typeof radius !== "number"
    ) {
      return errorResponse(
        "Invalid query parameters",
        ErrorCode.VALIDATION_ERROR,
      );
    }

    const authResult = await authenticateUser(token);

    if (authResult.status !== "Success") {
      return errorResponse(
        "Authentication failed",
        ErrorCode.AUTHENTICATION_ERROR,
      );
    }

    if (authResult.data.role !== "admin") {
      return errorResponse(
        "Access denied. Admin role required.",
        ErrorCode.AUTHORIZATION_ERROR,
      );
    }

    const lakes = await getLakesByLocation(latitude, longitude, radius);

    return lakes;
  } catch (error) {
    return errorResponse(getErrorMessage(error), ErrorCode.INTERNAL_ERROR);
  }
};

export { searchLakeByName, getNearbyLakes };
