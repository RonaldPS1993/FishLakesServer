/**
 * Test App Builder
 * Creates Fastify instance with mocked auth for testing
 */
import Fastify from "fastify";
import { routes } from "../../routes/index.js"
import { errorHandlerPlugin } from "../../plugins/errorHandler.plugin.js"

/**
 * Builds a test app with optional mock user
 * @param {object} mockUser - User to attach to all requests (null = no auth mock)
 */
export const buildTestApp = async (mockUser = null) => {
    const fastify = Fastify({ logger: false });

    //Register error handler plugin
    await fastify.register(errorHandlerPlugin);
    
    //Mock out decorators
    fastify.decorate("verifyToken", async (request) => {
        if (mockUser) {
            request.user = mockUser;
            request.userExists = true;
        }
    });

    fastify.decorate("requireAdmin", async (request) => {
        if (mockUser) {
            request.user = mockUser;
            request.userExists = true;
        }
    });
    
    fastify.decorate("requireAuth", async (request) => {
        if (mockUser) {
            request.user = mockUser;
            request.userExists = true;
        }
    });

    //Register routes
    await fastify.register(routes, { prefix: "/api" });

    return fastify;
}