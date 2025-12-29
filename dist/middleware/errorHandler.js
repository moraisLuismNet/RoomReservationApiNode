"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.errorConverter = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Convert error to ApiError, if needed
 */
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.default)) {
        // TypeORM or other errors check
        const statusCode = error.statusCode || (error.name === "QueryFailedError" ? 400 : 500);
        const message = error.message || "Internal Server Error";
        error = new ApiError_1.default(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
/**
 * Handle errors and send response
 */
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = 500; // Internal Server Error
        message = "Internal Server Error";
    }
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };
    if (process.env.NODE_ENV === "development") {
        logger_1.default.error(err);
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
/**
 * Catch 404 and forward to error handler
 */
const notFound = (req, res, next) => {
    const err = ApiError_1.default.notFound("Not Found");
    next(err);
};
exports.notFound = notFound;
