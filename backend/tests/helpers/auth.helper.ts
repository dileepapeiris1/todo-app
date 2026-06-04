// Third-party Libraries
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Internal Modules
import User from "@/models/user.model";
import { IUserDocument } from "@/types/user";

/**
 * Creates a user in the test DB and returns a signed JWT for that user.
 * @returns object with the user document and a ready-to-use auth token
 */
export async function createTestUser(): Promise<{
  user: IUserDocument;
  token: string;
}> {
  const user = await User.create({
    googleId: new mongoose.Types.ObjectId().toString(),
    email: "test@example.com",
    name: "Test User",
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return { user, token };
}

/**
 * Returns a formatted Bearer token header value.
 * @param token - raw JWT string
 * @returns Bearer token string for use in Authorization header
 */
export function bearerToken(token: string): string {
  return `Bearer ${token}`;
}
