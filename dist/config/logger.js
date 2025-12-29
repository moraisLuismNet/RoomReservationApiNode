"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
const { createLogger, transports } = winston_1.default;
const { combine, timestamp, printf, colorize } = winston_2.format;
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});
const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_2.format.errors({ stack: true }), process.env.NODE_ENV === "development" ? colorize() : winston_2.format.simple(), logFormat),
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
exports.default = logger;
