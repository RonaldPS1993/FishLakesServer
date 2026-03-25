import { getNearbyLakes, getLakeDetail } from "../../services/LakeServices.js";
import {
  authHeaderSchema,
  getNearbyLakesSchema,
  getLakeDetailSchema,
} from "../../schemas/index.js";
import { sendResponse } from "../../utils/index.js";

const lakesRoutes = async (fastify) => {
  /**
   * GET /api/lakes/nearby
   * Gets nearby lakes by latitude and longitude using PostGIS
   * Requires authenticated user
   *
   * Headers: Authorization: Bearer <supabase_token>
   * Query: lat=<latitude>&lng=<longitude>&radius=<radius>
   */
  fastify.get(
    "/nearby",
    {
      schema: {
        headers: authHeaderSchema,
        querystring: getNearbyLakesSchema,
      },
      preHandler: [fastify.requireAuth],
      config: {
        rateLimit: {
          max: 20,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, reply) => {
      const result = await getNearbyLakes(
        req.query.lat,
        req.query.lng,
        req.query.radius || 50000,
      );
      sendResponse(reply, result);
    },
  );

  /**
   * GET /api/lakes/:id
   * Gets lake detail by HydroLakes ID
   * Requires authenticated user
   *
   * Headers: Authorization: Bearer <supabase_token>
   * Params: id=<hylak_id>
   */
  fastify.get(
    "/:id",
    {
      schema: {
        headers: authHeaderSchema,
        params: getLakeDetailSchema,
      },
      preHandler: [fastify.requireAuth],
    },
    async (req, reply) => {
      const result = await getLakeDetail(parseInt(req.params.id));
      sendResponse(reply, result);
    },
  );
};

export { lakesRoutes };
