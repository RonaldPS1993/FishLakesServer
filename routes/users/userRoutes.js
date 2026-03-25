import { getUserFavorite } from "../../services/LakeServices.js";
import { authHeaderSchema } from "../../schemas/index.js";
import { sendResponse } from "../../utils/index.js";

const userRoutes = async (fastify) => {
  /**
   * GET /api/users/me/favorite
   * Returns the authenticated user's favorite lake or null
   *
   * Headers: Authorization: Bearer <supabase_token>
   */
  fastify.get(
    "/me/favorite",
    {
      schema: {
        headers: authHeaderSchema,
      },
      preHandler: [fastify.requireAuth],
    },
    async (req, reply) => {
      const result = await getUserFavorite(req.user.id);
      sendResponse(reply, result);
    },
  );
};

export { userRoutes };
