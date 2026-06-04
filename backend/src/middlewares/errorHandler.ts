// Third-party Libraries
import { ErrorRequestHandler } from "express";

// Internal Modules
import { ErrorMessage, MongooseErrorName } from "@/constants/errors";
import { HttpStatus } from "@/constants/http";
import { ErrorResponse } from "@/types/error";
import logger from "@/utils/logger";

/**
 * Global error handler.
 * @param err - Error passed via next(err)
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (required by Express error handler signature)
 * @returns 400 for Mongoose CastError or ValidationError, 500 for everything else
 */
export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next,
): void => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, {
    stack: err.stack,
  });

  if (err.name === MongooseErrorName.CAST_ERROR) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: ErrorMessage.INVALID_ID } as ErrorResponse);
    return;
  }

  if (err.name === MongooseErrorName.VALIDATION_ERROR) {
    const messages = Object.values(
      err.errors as Record<string, { message: string }>,
    )
      .map((e) => e.message)
      .join(", ");
    res.status(HttpStatus.BAD_REQUEST).json({ message: messages });
    return;
  }

  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: ErrorMessage.INTERNAL_ERROR } as ErrorResponse);
};
