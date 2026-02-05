import { UserCollectionRef } from "../models/UserModel.js";
import { auth } from "../config/firebase.js";
import {
  getErrorMessage,
  ErrorCode,
  successResponse,
  errorResponse,
} from "../utils/index.js";

/**
 * Creates a new user in the database
 * @param {object} payload - User data to store
 * @returns {Promise<object>} Standardized response
 */
const createUser = async (payload) => {
  try {
    const userCreated = await UserCollectionRef.add(payload);
    if (!userCreated.id) {
      return errorResponse("Error adding user to DB", ErrorCode.DATABASE_ERROR);
    }
    const responseData = { ...payload, id: userCreated.id };
    return successResponse("User added to DB", responseData);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Finds a user by Firebase UID
 * @param {string} uid - Firebase UID
 * @returns {Promise<object>} Standardized response
 */
const getUserByUid = async (uid) => {
  try {
    const userDocs = await UserCollectionRef.where("uid", "==", uid).get();
    if (userDocs.empty) {
      return errorResponse("No user found", ErrorCode.NOT_FOUND);
    }
    const userData = { ...userDocs.docs[0].data(), id: userDocs.docs[0].id };
    return successResponse("User found in DB", userData);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Authenticates user via Firebase token and retrieves user data
 * @param {string} token - Firebase ID token
 * @returns {Promise<object>} Standardized response with user data or Firebase user for registration
 */
const authenticateUser = async (token) => {
  try {
    const firebaseUser = await auth.verifyIdToken(token);

    const userResult = await getUserByUid(firebaseUser.uid);

    if (userResult.status === "Error") {
      return errorResponse("User not found in DB", ErrorCode.NOT_FOUND, {
        firebaseUser,
      });
    }

    return userResult;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.AUTHENTICATION_ERROR);
  }
};

export { createUser, getUserByUid, authenticateUser };
