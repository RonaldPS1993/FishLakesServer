import { authRoutes } from "./auth/authRoutes.js";
import { lakesRoutes } from "./lakes/lakesRoutes.js";
import { NODE_ENV } from "../config/index.js";

const routes = async (fastify) => {
  fastify.get("/", async (req, res) => {
    return { status: "Success", message: "Server is live" };
  });
  fastify.get("/health", async (req, res) => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
    };
  });

  
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(lakesRoutes, { prefix: "/lakes" });
};

export { routes };
