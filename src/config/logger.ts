import winston, { Logger } from "winston";
import { format } from "winston";

const { createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    process.env.NODE_ENV === "development" ? colorize() : format.simple(),
    logFormat
  ),
  defaultMeta: { service: "room-reservation-api" },
  transports: [
    new transports.Console()
  ],
  exitOnError: false,
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default logger;
