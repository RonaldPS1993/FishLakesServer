import Fastify from "fastify";
import "dotenv/config";
import { routes } from "./routes/index.js";

const buildApp = async (opts = {}) => {
  const fastify = Fastify({logger: true, ...opts});

  // Register plugins
  await fastify.register(import("@fastify/rate-limit"), {
    max: 25,
    timeWindow: 1000 * 60,
  });

  // Register routes
  fastify.register(routes, { prefix: "/api" });
  return fastify;
};

export  {buildApp};