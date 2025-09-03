const UserRef = require("../../models/UserModel");
const { admin } = require("../../config/firebase");

const authRoutes = async (fastify) => {
  fastify.post("/auth/register", async (req, res) => {
    const data = req.body;
    return { code: 200, body: data };
  });
};

module.exports = authRoutes;
