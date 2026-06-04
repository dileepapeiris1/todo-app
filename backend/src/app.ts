// Third-party Libraries
import cors from "cors";
import express, { Application, Router } from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

// Internal Modules
import {
  API_BASE_PATH,
  AUTH_RATE_LIMIT_MAX,
  DEFAULT_CLIENT_ORIGIN,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_SIZE_LIMIT,
} from "@/constants/config";
import { errorHandler } from "@/middlewares/errorHandler";
import { requestLogger } from "@/middlewares/requestLogger";
import authRoutes from "@/routes/auth.routes";
import todoRoutes from "@/routes/todo.routes";

/**
 * Initialise and configure the Todo Express app.
 * Kept separate from server.ts so tests can import the app without starting the server.
 * @returns configured Express application
 */
function initTodoApp(): Application {
  const app = express();

  app.use(helmet());

  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? DEFAULT_CLIENT_ORIGIN)
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  );

  app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
  app.use(mongoSanitize());
  app.use(requestLogger);

  const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    message: { message: "Too many requests, please try again later." },
  });

  const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: AUTH_RATE_LIMIT_MAX,
    message: { message: "Too many sign-in attempts, please try again later." },
  });

  const v1Router = Router();
  v1Router.use("/auth", authLimiter, authRoutes);
  v1Router.use("/todos", apiLimiter, todoRoutes);
  app.use(API_BASE_PATH, v1Router);

  app.use(errorHandler);

  return app;
}

export default initTodoApp;
