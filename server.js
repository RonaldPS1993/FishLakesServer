import "dotenv/config";
import { buildApp } from "./app.js";

const fastify = await buildApp();
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server is now listening on ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Add SIGTERM and SIGINT handlers here
process.on("SIGTERM", async () => {
  await fastify.close();
  console.log("Server is shutting down...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Server is shutting down...");
  await fastify.close();
  console.log("Server is shut down.");
  process.exit(0);
});
start();
