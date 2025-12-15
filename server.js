import "dotenv/config";

import Fastify from "fastify";

const fastify = Fastify({
  logger: false,
});
import { routes } from "./routes/index.js";

fastify.register(routes, { prefix: "/api" });
await fastify.register(import("@fastify/rate-limit"), {
  max: 25,
  timeWindow: 1000 * 60,
});

const port = process.env.PORT || 3000;

fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
