import { ApiError } from '@/services/api';
import type { ErrorInfo } from '@/types/common';

/**
 * Extracts the HTTP status code from an unknown error.
 * Defaults to 500 when the error is not an ApiError.
 *
 * @param {unknown} error - The caught error value.
 * @returns {number} HTTP status code.
 */
export function getErrorStatus(error: unknown): number {
  if (error instanceof ApiError) {
    return error.status;
  }
  return 500;
}

/**
 * Converts an unknown error into a structured ErrorInfo object
 * containing both the HTTP status code and a human-readable message.
 *
 * @param {unknown} error - The caught error value.
 * @returns {ErrorInfo} Structured error with status and message.
 */
export function toErrorInfo(error: unknown): ErrorInfo {
  return {
    status:  getErrorStatus(error),
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
}
