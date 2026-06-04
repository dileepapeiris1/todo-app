// Third-party Libraries
import dotenv from "dotenv";
dotenv.config();

// Internal Modules
import initTodoApp from "@/app";
import { connectDB, disconnectDB } from "@/config/db";
import { DEFAULT_PORT, REQUIRED_ENV_VARS } from "@/constants/config";
import logger from "@/utils/logger";

// Error handlers 
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught exception — shutting down", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled promise rejection — shutting down", { reason });
  process.exit(1);
});

/** Validate all required env vars are set before the server boots. */
function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
    process.exit(1);
  }
}

/** Connect to the DB then start listening. */
async function bootstrap(): Promise<void> {
  validateEnv();

  await connectDB();

  const app = initTodoApp();
  const PORT = process.env.PORT ?? DEFAULT_PORT;

  const server = app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown 
  async function shutdown(signal: string): Promise<void> {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err: Error) => {
  logger.error("Failed to start server", { error: err.message });
  process.exit(1);
});
