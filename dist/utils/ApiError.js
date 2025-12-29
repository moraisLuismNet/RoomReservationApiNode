"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/ApiError.ts
/**
 * Extend the standard Error class to include a status code and operational flag
 */
class ApiError extends Error {
    /**
     * Create ApiError
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {boolean} isOperational - Is this a known operational error (vs. programming error)
     * @param {string} stack - Error stack trace
     */
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
        // Set the prototype explicitly (needed for instanceof to work with custom errors in TypeScript)
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    /**
     * Create a bad request error (400)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static badRequest(message) {
        return new ApiError(400, message);
    }
    /**
     * Create an unauthorized error (401)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    /**
     * Create a forbidden error (403)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
    /**
     * Create a not found error (404)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }
    /**
     * Create a conflict error (409)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }
    /**
     * Create an internal server error (500)
     * @param {string} message - Error message
     * @param {boolean} isOperational - Is this a known operational error
     * @returns {ApiError}
     */
    static internal(message = "Internal Server Error", isOperational = false) {
        return new ApiError(500, message, isOperational);
    }
}
exports.default = ApiError;
