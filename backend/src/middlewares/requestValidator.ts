// Third-party Libraries
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

// Internal Modules
import { HttpStatus } from "@/constants/http";
import { toValidationErrorResponse } from "@/utils/response";

/**
 * Checks express-validator results.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns 400 with validation errors if any validator chain failed
 */
export const validate: RequestHandler = (req, res, next): void => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json(toValidationErrorResponse(result));
    return;
  }

  next();
};
