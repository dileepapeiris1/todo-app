/** Standard error response body. */
export interface ErrorResponse {
  message: string;
}

/** Single item in the validation errors array. */
export interface ValidationErrorItem {
  msg: string;
  path: string;
  location: string;
  value: string | number | boolean | null | undefined;
}

/** Response body when request validation fails. */
export interface ValidationErrorResponse {
  errors: ValidationErrorItem[];
}
