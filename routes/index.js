const auth = require("./auth/authRoutes")

const routes = async (fastify) => {
  fastify.get("/", async (req, res) => {
    return "Server is live";
  });
  fastify.register(auth)
};

module.exports = routes;
