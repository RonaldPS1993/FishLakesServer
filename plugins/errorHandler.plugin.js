import { AppError, errorResponse, ErrorCode, HttpStatus } from "../utils/index";

const errorHandlerPlugin = async (fastify) => {
  // GLobal Error Handler
  fastify.setErrorHandler((error, request, reply) => {
    // Log the error with request details
    fastify.log.error({
      err: error,
      request: {
        method: request.method,
        url: request.url,
        params: request.params,
        query: request.query,
      },
    });

    //Handle fastify validation errors
    if (error.validation) {
      const message = error.message || "Validation error";
      return reply
        .code(HttpStatus.BAD_REQUEST)
        .send(
          errorResponse(message, ErrorCode.VALIDATION_ERROR, error.validation),
        );
    }
  });
};
