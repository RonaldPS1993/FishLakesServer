import { createUser, authenticateUser } from "../modules/UserModules.js";
import {
  getErrorMessage,
  ErrorCode,
  successResponse,
  errorResponse,
} from "../utils/index.js";
import { ADMIN_EMAIL } from "../config/index.js";

/**
 * Registers a new user
 * @param {object} data - Registration data { token, email }
 * @returns {Promise<object>} Standardized response
 */
const registerUser = async (data) => {
  try {
    const authResult = await authenticateUser(data.token);

    if (authResult.status === "Success") {
      return errorResponse("User already exists", ErrorCode.VALIDATION_ERROR);
    }

    if (authResult.code !== ErrorCode.NOT_FOUND) {
      return authResult;
    }

    const firebaseUser = authResult.details?.firebaseUser;
    if (!firebaseUser || !firebaseUser.uid) {
      return errorResponse(
        "Invalid authentication token",
        ErrorCode.AUTHENTICATION_ERROR
      );
    }

    const payload = {
      uid: firebaseUser.uid,
      email: data.email,
      role: data.email === ADMIN_EMAIL ? "admin" : "user",
      createdAt: Date.now(),
    };

    const newUser = await createUser(payload);
    return newUser;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

/**
 * Logs in an existing user
 * @param {object} data - Login data { token, email }
 * @returns {Promise<object>} Standardized response
 */
const loginUser = async (data) => {
  try {
    const authResult = await authenticateUser(data.token);

    if (authResult.status === "Error") {
      if (authResult.code === ErrorCode.NOT_FOUND) {
        return errorResponse(
          "User not registered. Please sign up first",
          ErrorCode.NOT_FOUND
        );
      }
      return authResult;
    }

    return successResponse("Login successful", authResult.data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.INTERNAL_ERROR);
  }
};

export { registerUser, loginUser };
