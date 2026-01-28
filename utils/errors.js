export class AppError extends Error {
    constructor(message, statusCode, code, isOperational) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message, isOperational) {
        super(message, 400, "VALIDATION_ERROR", isOperational);
    }
}

export class AuthenticationError extends AppError {
    constructor(message, isOperational) {
        super(message, 401, "AUTHENTICATION_ERROR", isOperational);
    }
}

export class AuthorizationError extends AppError {
    constructor(message, isOperational) {
        super(message, 403, "AUTHORIZATION_ERROR", isOperational);
    }
}

export class NotFoundError extends AppError {
    constructor(message, isOperational) {
        super(message, 404, "NOT_FOUND", isOperational);
    }
}

export class DatabaseError extends AppError {
    constructor(message, isOperational) {
        super(message, 500, "DATABASE_ERROR", isOperational);
    }
}

export class ExternalServiceError extends AppError {
    constructor(message, isOperational) {
        super(message, 502, "EXTERNAL_API_ERROR", isOperational);
    }
}

export class InternalServerError extends AppError {
    constructor(message, isOperational) {
        super(message, 500, "INTERNAL_ERROR", isOperational);
    }
}