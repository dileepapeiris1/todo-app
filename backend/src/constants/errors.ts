/** API error messages. */
export const ErrorMessage = {
  TODO_NOT_FOUND: "Todo not found",
  INVALID_ID: "Invalid todo ID format",
  INTERNAL_ERROR: "Internal server error",
} as const;

/** Mongoose error names used in the error handler. */
export const MongooseErrorName = {
  CAST_ERROR: "CastError",
  VALIDATION_ERROR: "ValidationError",
} as const;
