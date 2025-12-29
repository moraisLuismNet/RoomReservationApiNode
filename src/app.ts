import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";

// Import routes (to be created/converted)
// Import routes
import authRoutes from "./routes/authRoutes";
import roomTypeRoutes from "./routes/roomTypeRoutes";
import roomRoutes from "./routes/roomRoutes";
import reservationStatusRoutes from "./routes/reservationStatusRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import userRoutes from "./routes/userRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import emailQueueRoutes from "./routes/emailQueueRoutes";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RoomReservationApiNode",
      version: "v1",
      description: "RoomReservationApiNode documentation",
      contact: {
        name: "API Support",
        email: "morais.luism.net@gmail.com",
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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customSiteTitle: "RoomReservationApiNode",
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.redirect("/api-docs");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservation-statuses", reservationStatusRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email-queues", emailQueueRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
