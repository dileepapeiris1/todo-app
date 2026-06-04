// Third-party Libraries
import { Result, ValidationError } from "express-validator";

// Internal Modules
import { ValidationErrorItem, ValidationErrorResponse } from "@/types/error";

/**
 * Converts an express-validator result into a typed ValidationErrorResponse.
 * @param result - express-validator result object
 * @returns structured validation error response
 */
export function toValidationErrorResponse(
  result: Result<ValidationError>,
): ValidationErrorResponse {
  return {
    errors: result.array() as ValidationErrorItem[],
  };
}
