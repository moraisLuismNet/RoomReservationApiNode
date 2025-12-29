"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("./config/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes (to be created/converted)
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const roomTypeRoutes_1 = __importDefault(require("./routes/roomTypeRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const reservationStatusRoutes_1 = __importDefault(require("./routes/reservationStatusRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const emailQueueRoutes_1 = __importDefault(require("./routes/emailQueueRoutes"));
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// HTTP request logging
if (process.env.NODE_ENV !== "test") {
    app.use((0, morgan_1.default)("combined", {
        stream: { write: (message) => logger_1.default.info(message.trim()) },
    }));
}
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RoomReservationApiNet",
            version: "v1",
            description: "RoomReservationApiNet documentation",
            contact: {
                name: "API Support",
                email: "support@roomreservation.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Path to the API routes and TypeORM entities
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs, {
    customSiteTitle: "RoomReservationApiNet",
}));
// Routes
app.get("/", (req, res) => {
    res.redirect("/api-docs");
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/room-types", roomTypeRoutes_1.default);
app.use("/api/rooms", roomRoutes_1.default);
app.use("/api/reservation-statuses", reservationStatusRoutes_1.default);
app.use("/api/reservations", reservationRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/email-queues", emailQueueRoutes_1.default);
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Resource not found",
    });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
