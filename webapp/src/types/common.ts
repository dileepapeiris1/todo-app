/** MongoDB ObjectId represented as a string. */
export type ID = string;

/** ISO 8601 datetime string, e.g. "2026-06-04T14:30:00.000Z". */
export type ISODateString = string;

/** Generic nullable wrapper. */
export type Nullable<T> = T | null;

/** Structured error from a failed API call, carrying both HTTP status and message. */
export interface ErrorInfo {
  status: number;
  message: string;
}
