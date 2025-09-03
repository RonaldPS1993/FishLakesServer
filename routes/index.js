const auth = require("./auth/authRoutes");
const lakes = require("./lakes/lakesRoutes");

const routes = async (fastify) => {
  fastify.get("/", async (req, res) => {
    return "Server is live";
  });
  fastify.register(auth);
  fastify.register(lakes, { prefix: "/lakes" });
};

module.exports = routes;
