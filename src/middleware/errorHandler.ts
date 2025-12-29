import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import logger from "../config/logger";

/**
 * Convert error to ApiError, if needed
 */
export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // TypeORM or other errors check
    const statusCode =
      error.statusCode || (error.name === "QueryFailedError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

/**
 * Handle errors and send response
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

/**
 * Catch 404 and forward to error handler
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = ApiError.notFound("Not Found");
  next(err);
};
