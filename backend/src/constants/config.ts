/** Default MongoDB connection URI for local development. */
export const DEFAULT_MONGO_URI = "mongodb://localhost:27017/todoapp";

/** Default server port. */
export const DEFAULT_PORT = 5000;

/** Default allowed CORS origin. */
export const DEFAULT_CLIENT_ORIGIN = "http://localhost:5173";

/** Current API version string. */
export const API_VERSION = "v1";

/** Versioned API base path. */
export const API_BASE_PATH = `/api/${API_VERSION}`;

/** Base path for the todo API routes. */
export const API_TODOS_PATH = `${API_BASE_PATH}/todos`;

/** Base path for auth routes. */
export const AUTH_PATH = `${API_BASE_PATH}/auth`;

/** Max allowed request body size. */
export const REQUEST_SIZE_LIMIT = "10kb";

/** Rate limit window in milliseconds (15 minutes). */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Max requests per window for general API routes. */
export const RATE_LIMIT_MAX = 100;

/** Stricter limit for auth routes to prevent brute force. */
export const AUTH_RATE_LIMIT_MAX = 10;

/** MongoDB server selection timeout in milliseconds. */
export const DB_SERVER_SELECTION_TIMEOUT_MS = 5000;

/** Environment variables that must be set before the server starts. */
export const REQUIRED_ENV_VARS = ["JWT_SECRET", "GOOGLE_CLIENT_ID"] as const;
