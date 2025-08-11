const authRoutes = async (fastify) => {
  fastify.get("/auth/register", async (req, res) => {
    return { route: "auth", endpoint: "register" };
  });
};

module.exports = authRoutes