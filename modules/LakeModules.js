import { supabaseAdmin } from "../config/supabase.js";
import {
  getErrorMessage,
  ErrorCode,
  successResponse,
  errorResponse,
} from "../utils/index.js";

/**
 * Gets nearby lakes using PostGIS RPC function
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusMeters - Search radius in meters
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<object>} Standardized response with array of nearby lakes
 */
const getNearbyLakesFromDB = async (lat, lng, radiusMeters, maxResults = 100) => {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_nearby_lakes", {
      lat,
      lng,
      radius_meters: radiusMeters,
      max_results: maxResults,
    });

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Nearby lakes fetched", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Gets a lake by HydroLakes ID from the hydrolakes table
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response
 */
const getLakeById = async (hylakId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("hydrolakes")
      .select("hylak_id, lake_name, pour_lat, pour_long, lake_area, depth_avg, country")
      .eq("hylak_id", hylakId)
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    if (!data) {
      return errorResponse("Lake not found", ErrorCode.NOT_FOUND);
    }

    return successResponse("Lake found", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Gets cached lake data from the lakes enrichment table
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response
 */
const getCachedLake = async (hylakId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lakes")
      .select("*")
      .eq("hylak_id", hylakId)
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    if (!data) {
      return errorResponse("No cached lake", ErrorCode.NOT_FOUND);
    }

    return successResponse("Cached lake found", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Creates a cached lake entry in the lakes enrichment table
 * @param {object} payload - Lake data { hylak_id, lake_name, photo_url, photo_source, about }
 * @returns {Promise<object>} Standardized response
 */
const createCachedLake = async (payload) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lakes")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Lake cached", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Updates an existing cached lake entry
 * @param {number} hylakId - HydroLakes unique ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Standardized response
 */
const updateCachedLake = async (hylakId, updates) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lakes")
      .update(updates)
      .eq("hylak_id", hylakId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Lake cache updated", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Sets a user's favorite lake by updating profiles.favorite_lake_id
 * @param {string} userId - Supabase auth user ID
 * @param {string} lakeId - UUID from the lakes cache table
 * @returns {Promise<object>} Standardized response
 */
const setFavoriteLake = async (userId, lakeId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ favorite_lake_id: lakeId })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Favorite lake set", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Removes a user's favorite lake by setting favorite_lake_id to null
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<object>} Standardized response
 */
const removeFavoriteLake = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ favorite_lake_id: null })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Favorite lake removed", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Gets a user's favorite lake with full lake data via join
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<object>} Standardized response with lake data or null
 */
const getFavoriteLake = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("favorite_lake_id, lakes:favorite_lake_id(*)")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    if (!data?.favorite_lake_id) {
      return successResponse("No favorite set", null);
    }

    return successResponse("Favorite lake found", data.lakes);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

export {
  getNearbyLakesFromDB,
  getLakeById,
  getCachedLake,
  createCachedLake,
  updateCachedLake,
  setFavoriteLake,
  removeFavoriteLake,
  getFavoriteLake,
};
