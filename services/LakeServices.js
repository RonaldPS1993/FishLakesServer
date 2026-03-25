import { getLakeById } from "../modules/LakeModules.js";
import { supabaseAdmin } from "../config/supabase.js";
import {
  successResponse,
  errorResponse,
  getErrorMessage,
  ErrorCode,
} from "../utils/index.js";

/**
 * Gets nearby lakes using PostGIS RPC function
 * @param {number} latitude - Latitude of the location
 * @param {number} longitude - Longitude of the location
 * @param {number} radius - Radius in meters
 * @returns {Promise<object>} Standardized response
 */
const getNearbyLakes = async (latitude, longitude, radius) => {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_nearby_lakes", {
      lat: latitude,
      lng: longitude,
      radius_meters: radius,
      max_results: 100,
    });

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("Nearby lakes fetched", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Gets lake detail by HydroLakes ID
 * Plan 02 will add photo caching logic
 * @param {number} hylakId - HydroLakes unique ID
 * @returns {Promise<object>} Standardized response
 */
const getLakeDetail = async (hylakId) => {
  try {
    const result = await getLakeById(hylakId);
    return result;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

export { getNearbyLakes, getLakeDetail };
