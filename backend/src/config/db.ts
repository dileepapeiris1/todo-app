// Third-party Libraries
import mongoose from "mongoose";

// Internal Modules
import {
  DB_SERVER_SELECTION_TIMEOUT_MS,
  DEFAULT_MONGO_URI,
} from "@/constants/config";
import logger from "@/utils/logger";

/** Connect to MongoDB. */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? DEFAULT_MONGO_URI;

  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB error", { error: err.message }),
  );

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: DB_SERVER_SELECTION_TIMEOUT_MS,
  });

  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
}

/** Close the MongoDB connection. */
export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
}
