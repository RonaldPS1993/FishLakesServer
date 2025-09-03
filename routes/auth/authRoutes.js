<<<<<<< HEAD
const UserRef = require("../../models/UserModel");
const { admin } = require("../../config/firebase");

const authRoutes = async (fastify) => {
  fastify.post("/auth/register", async (req, res) => {
    const data = req.body;
    return { code: 200, body: data };
  });
};

module.exports = authRoutes;
=======
const authRoutes = async (fastify) => {
  fastify.get("/auth/register", async (req, res) => {
    return { route: "auth", endpoint: "register" };
  });
};

module.exports = authRoutes
>>>>>>> 766b6faccc586bfa17040045cb6bbfd192d7cab4
