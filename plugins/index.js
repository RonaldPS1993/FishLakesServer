import { errorHandlerPlugin } from "./errorHandler.plugin.js";
import { authPlugin } from "./auth.plugin.js";
import { RATE_LIMIT_MAX, RATE_LIMIT_TIME_WINDOW } from "../config/index.js";

const registerPlugins = async (fastify) => {
  await fastify.register(import("@fastify/rate-limit"), {
    max: Number(RATE_LIMIT_MAX || 25),
    timeWindow: Number(RATE_LIMIT_TIME_WINDOW || 60000),
  });

  await fastify.register(errorHandlerPlugin);
  await fastify.register(authPlugin);
};

export { registerPlugins };
