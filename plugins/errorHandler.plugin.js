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
        body: request.body,
      },
    });

    //Handle fastify validation errors (from JSON Schema Validation)
    if (error.validation) {
      const message = error.message || "Validation error";
      return reply
        .code(HttpStatus.BAD_REQUEST)
        .send(
          errorResponse(message, ErrorCode.VALIDATION_ERROR, error.validation)
        );
    }

    // Handle reate limits erros
    if (error.statusCode === 429) {
      return reply
        .code(429)
        .send(
          errorResponse("Too many requests. Please try again later.", "429")
        );
    }

    // Handle app errors
    if (error instanceof AppError) {
      return reply
        .code(error.statusCode)
        .send(errorResponse(error.message, error.code));
    }

    // Handle other known HTTP errors
    if (error.statusCode >= 400 && error.statusCode < 500) {
      return reply
        .code(error.statusCode)
        .send(errorResponse(error.message, "UNKNOWN_ERROR"));
    }

    // Handle unexpected errors
    const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : error.message;
    return reply
      .code(statusCode)
      .send(errorResponse(message, ErrorCode.INTERNAL_ERROR));
  });

  fastify.setNotFoundHandler((request, reply) => {
    return reply
      .code(HttpStatus.NOT_FOUND)
      .send(errorResponse("Not Found", ErrorCode.NOT_FOUND));
  });
};

export { errorHandlerPlugin };
