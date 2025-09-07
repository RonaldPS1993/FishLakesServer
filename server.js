require("dotenv").config();

const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("./routes/index"), { prefix: "/api" });

const port = process.env.PORT || 3000;

fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
