import { supabaseAdmin } from "../config/supabase.js";
import {
  getErrorMessage,
  ErrorCode,
  successResponse,
  errorResponse,
} from "../utils/index.js";

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
 * Gets cached lake photo from lake_photos table
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response
 */
const getCachedLake = async (hylakId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lake_photos")
      .select("*")
      .eq("hylak_id", hylakId)
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    if (!data) {
      return errorResponse("No cached photo found", ErrorCode.NOT_FOUND);
    }

    return successResponse("Cached lake photo found", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Creates a cached lake photo entry in lake_photos table
 * @param {object} payload - Lake photo data { hylak_id, photo_url, photo_source }
 * @returns {Promise<object>} Standardized response
 */
const createCachedLake = async (payload) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lake_photos")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Lake photo cached", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

export { getLakeById, getCachedLake, createCachedLake };
