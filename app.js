import Fastify from "fastify";
import { routes } from "./routes/index.js";
import { registerPlugins } from "./plugins/index.js";

const buildApp = async (opts = {}) => {
  const fastify = Fastify({ logger: false, ...opts });

  // Register plugins
  await registerPlugins(fastify);

  // Register routes
  fastify.register(routes, { prefix: "/api" });
  return fastify;
};

export { buildApp };
