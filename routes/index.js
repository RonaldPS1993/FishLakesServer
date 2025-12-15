import { authRoutes } from "./auth/authRoutes.js";
import { lakesRoutes } from "./lakes/lakesRoutes.js";

const routes = async (fastify) => {
  fastify.get("/", async (req, res) => {
    return "Server is live";
  });
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(lakesRoutes, { prefix: "/lakes" });
};

export { routes };
