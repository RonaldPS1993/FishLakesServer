import { authenticateUser } from "../modules/UserModules.js";
import {
  AuthenticationError,
  AuthorizationError,
  ErrorCode,
} from "../utils/index.js";

/**
 * Extracts the token from the Authorization header
 * Expected format: "Bearer <token>"
 * @param {string} authHeader - The Authorization header value
 * @returns {string|null} The extracted token or null
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || typeof authHeader !== "string") return null;

  //Check for "Bearer " prefix (case insensitive)
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return null;

  return parts[1];
};

const authPlugin = async (fastify) => {
  /**
   * Decorator to verify Firebase token and attach user to request
   * Usage: { preHandler: [fastify.verifyToken] }
   */
  fastify.decorate("verifyToken", async (request) => {
    const authHeader = request.headers["authorization"];
    const token = extractBearerToken(authHeader);

    if (!token) {
      throw new AuthenticationError(
        "Authorization header required. Format: Bearer <token>"
      );
    }

    const authResult = await authenticateUser(token);
    if (authResult.status === "Error") {
      if (authResult.code === ErrorCode.NOT_FOUND) {
        request.user = authResult.details?.firebaseUser || null;
        request.userExists = false;
      }
      throw new AuthenticationError(
        authResult.message || "Authentication failed"
      );
    }

    request.user = authResult.data;
    request.userExists = true;
  });
};
