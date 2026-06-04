// Third-party Libraries
import winston from "winston";

// Internal Modules
import { Environment, LogLevel } from "@/constants/environment";

/** Winston logger */
const { combine, timestamp, errors, json, printf } = winston.format;

/** development format. */
const devFormat = combine(
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    const msg = stack ? `${message}\n${stack}` : message;
    return `[${timestamp}] ${level.padEnd(5)} ${msg}`;
  }),
);

/** JSON format for production. */
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const isDev = process.env.NODE_ENV !== Environment.Production;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (isDev ? LogLevel.Debug : LogLevel.Warn),
  format: isDev ? devFormat : prodFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
