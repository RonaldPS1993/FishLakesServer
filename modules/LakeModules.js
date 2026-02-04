import { LakesCollectionRef } from "../models/LakesModel.js";
import { getErrorMessage, ErrorCode, successResponse, errorResponse } from "../utils/index.js";

/**
 * Creates a new lake in the database
 * @param {object} payload - Lake data to store
 * @returns {Promise<object>} Standardized response
 */
const createLake = async (payload) => {
  try {
    const lakeCreated = await LakesCollectionRef.add(payload);
    if (!lakeCreated.id) {
      return errorResponse("Error adding lake to DB", ErrorCode.DATABASE_ERROR);
    } 
    const responseData = { ...payload, id: lakeCreated.id };
    return successResponse("Lake added to DB", responseData);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Finds a lake by search name
 * @param {string} searchName - Name to search for
 * @returns {Promise<object>} Standardized response
 */

const getLakeByName = async (searchName) => {

  try {
    const normalizedSearchName = searchName.toLowerCase().trim();
    const lakes = await LakesCollectionRef.where(
      "searchName",
      "==",
      normalizedSearchName
    ).get();
    if (lakes.empty) {
      return errorResponse("No lake found", ErrorCode.NOT_FOUND);
    }
    
    const lakeData = {...lakes.docs[0].data(), id: lakes.docs[0].id};
    return successResponse("Lake found in database", lakeData);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

export { createLake, getLakeByName };
