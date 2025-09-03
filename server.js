require("dotenv").config();

const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("./routes/index"), { prefix: "/api" });

fastify.listen({ port: process.env.PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
