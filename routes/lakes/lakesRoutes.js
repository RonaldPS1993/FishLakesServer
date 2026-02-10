import { searchLakeByName } from "../../services/LakeServices.js";
import {
  authHeaderSchema,
  searchLakeByNameSchema,
} from "../../schemas/index.js";
import { sendResponse } from "../../utils/index.js";

/**
 * Extracts bearer token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string} The token without "Bearer " prefix
 */
const extractToken = (authHeader) => {
  return authHeader.replace(/^Bearer\s+/i, "");
};

const lakesRoutes = async (fastify) => {
  /**
   * GET /api/lakes/search
   * Searches for a lake by name
   * Requires admin authentication
   *
   * Headers: Authorization: Bearer <firebase_token>
   * Query: name=<lake_name>
   */
  fastify.get(
    "/search",
    {
      schema: {
        headers: authHeaderSchema,
        query: searchLakeByNameSchema,
      },
      config: {
        rateLimit: {
          max: 20,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, reply) => {
      const token = extractToken(req.headers.authorization);
      const result = await searchLakeByName(req.query.name, token);
      sendResponse(reply, result);
    },
  );
};
export { lakesRoutes };
