import { registerUser, loginUser } from "../../services/UserServices.js";
import {
  authHeaderSchema,
  registerUserSchema,
  loginUserSchema,
} from "../../schemas/index.js";
import { extractToken, sendResponse } from "../../utils/index.js";

const authRoutes = async (fastify) => {
  /**
   * POST /api/auth/register
   * Registers a new user
   *
   * Headers: Authorization: Bearer <supabase_token>
   * Body: none required -- email extracted from JWT
   */
  fastify.post(
    "/register",
    {
      schema: {
        headers: authHeaderSchema,
        body: registerUserSchema,
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, reply) => {
      const payload = {
        token: extractToken(req.headers.authorization),
      };

      const result = await registerUser(payload);
      sendResponse(reply, result);
    },
  );

  /**
   * POST /api/auth/login
   * Authenticates an existing user
   *
   * Headers: Authorization: Bearer <supabase_token>
   * Body: none required -- identity from JWT
   */
  fastify.post(
    "/login",
    {
      schema: {
        headers: authHeaderSchema,
        body: loginUserSchema,
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, reply) => {
      const payload = {
        token: extractToken(req.headers.authorization),
      };

      const result = await loginUser(payload);
      sendResponse(reply, result);
    },
  );
};

export { authRoutes };
