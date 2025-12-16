import { registerUser, loginUser } from "../../services/UserServices.js";

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
    async (req, reply) => {
      if (req.headers["bearer"] != undefined) {
        const userToken = req.headers["bearer"];
        const data = req.body;

        if (data.email != undefined) {
          let payload = { token: userToken, email: data.email };
          console.log(payload, "DATA");
          const userSignup = await registerUser(payload);
          if (userSignup.status == "Success") {
            reply.code(200).send({ description: userSignup.msg });
          } else {
            reply.code(401).send({ description: userSignup.msg });
          }
        } else {
          reply.code(400).send({ description: "The body is not valid" });
        }
      } else {
        reply.code(401).send({ description: "Not valid headers." });
      }
    }
  );

  fastify.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 1000 * 60,
        },
      },
    },
    async (req, reply) => {
      if (req.headers["bearer"] != undefined) {
        const userToken = req.headers["bearer"];
        const data = req.body;
        if (data.email != undefined) {
          let payload = { token: userToken, email: data.email };
          console.log(payload);
          const userLogin = await loginUser(payload);
          if (userLogin.status == "Success") {
            reply.code(200).send({ description: userLogin.msg });
          } else {
            reply.code(401).send({ description: userLogin.msg });
          }
        } else {
          reply.code(400).send({ description: "The body is not valid" });
        }
      } else {
      }
    }
  );
};

export { authRoutes };
