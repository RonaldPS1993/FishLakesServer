import { supabaseAdmin } from "../config/supabase.js";
import {
  getErrorMessage,
  ErrorCode,
  successResponse,
  errorResponse,
} from "../utils/index.js";

/**
 * Creates a new user in the profiles table
 * @param {object} payload - User data { id, username, role }
 * @returns {Promise<object>} Standardized response
 */
const createUser = async (payload) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    return successResponse("User added to DB", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Finds a user by Supabase user ID in the profiles table
 * @param {string} userId - Supabase auth user ID
 * @returns {Promise<object>} Standardized response
 */
const getUserById = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, ErrorCode.DATABASE_ERROR);
    }

    if (!data) {
      return errorResponse("No user found", ErrorCode.NOT_FOUND);
    }

    return successResponse("User found in DB", data);
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.DATABASE_ERROR);
  }
};

/**
 * Authenticates user via Supabase token and retrieves user data
 * @param {string} token - Supabase access token
 * @returns {Promise<object>} Standardized response with user data or Supabase user for registration
 */
const authenticateUser = async (token) => {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return errorResponse("Invalid or expired token", ErrorCode.AUTHENTICATION_ERROR);
    }

    const userResult = await getUserById(user.id);

    if (userResult.status === "Error") {
      return errorResponse("User not found in DB", ErrorCode.NOT_FOUND, {
        supabaseUser: user,
      });
    }

    return userResult;
  } catch (err) {
    return errorResponse(getErrorMessage(err), ErrorCode.AUTHENTICATION_ERROR);
  }
};

export { createUser, getUserById, authenticateUser };
