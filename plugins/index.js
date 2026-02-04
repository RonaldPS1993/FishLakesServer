import { errorHandlerPlugin } from "./errorHandler.plugin.js";
import { authPlugin } from "./auth.plugin.js";

const registerPlugins = async (fastify) => {
  await fastify.register(import("@fastify/rate-limit"), {
    max: Number(process.env.RATE_LIMIT_MAX || 25),
    timeWindow: Number(process.env.RATE_LIMIT_TIME_WINDOW || 60000),
  });

  await fastify.register(errorHandlerPlugin);
  await fastify.register(authPlugin);
};

export { registerPlugins };
