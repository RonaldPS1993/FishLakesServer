import { registerUser, loginUser } from "../../services/UserServices.js";
import {
  authHeaderSchema,
  registerUserSchema,
  loginUserSchema,
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
const authRoutes = async (fastify) => {
  /**
   * POST /api/auth/register
   * Registers a new user
   *
   * Headers: Authorization: Bearer <firebase_token>
   * Body: { email: string }
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
        email: req.body.email,
      }

      const result  = await registerUser(payload);
      sendResponse(reply, result);
    },
  );

   /**
   * POST /api/auth/login
   * Authenticates an existing user
   * 
   * Headers: Authorization: Bearer <firebase_token>
   * Body: { email: string }
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
        email: req.body.email,
      }

      const result = await loginUser(payload);
      sendResponse(reply, result);
    },
  );
};

export { authRoutes };
