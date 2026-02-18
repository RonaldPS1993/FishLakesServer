import { searchLakeByName, getNearbyLakes } from "../../services/LakeServices.js";
import {
  authHeaderSchema,
  searchLakeByNameSchema,
  getNearbyLakesSchema
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

  /**
   * GET /api/lakes/getNearbyLakes
   * Gets nearby lakes by latitude and longitude
   * Requires admin authentication
   *
   * Headers: Authorization: Bearer <firebase_token>
   * Query: latitude=<latitude>
   * Query: longitude=<longitude>
   * Query: radius=<radius>
   */
  fastify.get("/getNearbyLakes", {
    schema: {
      headers: authHeaderSchema,
      query: getNearbyLakesSchema,
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
    const result = await getNearbyLakes(req.query.latitude, req.query.longitude, req.query.radius, token);
    sendResponse(reply, result);
  },
);
};


export { lakesRoutes };
