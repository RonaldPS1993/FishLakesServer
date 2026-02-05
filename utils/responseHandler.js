import { NODE_ENV } from "../config/index.js";
/**
 * Standardized Response Handler
 * Provides consistent response formats across the application
 */

// Standard HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
};

// Application Error Codes
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

/**
 * Creates a standardized success response
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @returns {object} Standardized success response
 */
export const successResponse = (message, data = null) => {
  const response = {
    status: "Success",
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

/**
 * Creates a standardized error response
 * @param {string} message - Error message
 * @param {string} code - Error code from ErrorCode enum
 * @param {any} details - Additional error details (only in development)
 * @returns {object} Standardized error response
 */
export const errorResponse = (
  message,
  code = ErrorCode.INTERNAL_ERROR,
  details = null,
) => {
  const response = {
    status: "Error",
    message,
    code,
  };
  // Only include details in non-production environments
  if (details && NODE_ENV !== "production") {
    response.details = details;
  }
  return response;
};

/**
 * Extracts a safe error message from various error types
 * @param {Error|string|object} error - The error to extract message from
 * @returns {string} Safe error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Maps error codes to HTTP status codes
 * @param {string} errorCode - Application error code
 * @returns {number} HTTP status code
 */
export const getHttpStatusFromErrorCode = (errorCode) => {
  const mapping = {
    [ErrorCode.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
    [ErrorCode.AUTHENTICATION_ERROR]: HttpStatus.UNAUTHORIZED,
    [ErrorCode.AUTHORIZATION_ERROR]: HttpStatus.FORBIDDEN,
    [ErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCode.DATABASE_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCode.EXTERNAL_API_ERROR]: HttpStatus.BAD_GATEWAY,
    [ErrorCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  };
  return mapping[errorCode] || HttpStatus.INTERNAL_SERVER_ERROR;
};

/**
 * Helper to send standardized API response
 * @param {object} reply - Fastify reply object
 * @param {object} result - Result from service/module layer
 */
export const sendResponse = (reply, result) => {
  if (result.status === "Success") {
    reply.code(HttpStatus.OK).send(result);
  } else {
    const httpStatus = getHttpStatusFromErrorCode(result.code);
    reply.code(httpStatus).send(result);
  }
};
