import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./config/data/data-source";
import app from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );

      // Open browser automatically in development
      if (process.env.NODE_ENV !== "production") {
        const url = `http://localhost:${PORT}/api-docs`;
        const start =
          process.platform == "darwin"
            ? "open"
            : process.platform == "win32"
            ? "start"
            : "xdg-open";
        require("child_process").exec(`${start} ${url}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
startServer();
