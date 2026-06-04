// Third-party Libraries
import { RequestHandler } from "express";

// Internal Modules
import logger from "@/utils/logger";

/**
 * Logs each HTTP request.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const requestLogger: RequestHandler = (req, res, next): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });

  next();
};
