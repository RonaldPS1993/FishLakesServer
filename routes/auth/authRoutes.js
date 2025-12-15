import { registerUser } from "../../services/UserServices.js";

const authRoutes = async (fastify) => {
  fastify.post(
    "/register",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, res) => {
      const data = req.body;
      if (data.token != undefined && data.email != undefined) {
        const userSignup = await registerUser(data);
        if (userSignup.status == "Success") {
          res.status(200);
          res.send({ description: userSignup.msg });
        }
      }
    }
  );
};

export { authRoutes };
