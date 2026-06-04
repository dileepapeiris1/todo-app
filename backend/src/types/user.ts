// Third-party Libraries
import { Document } from "mongoose";

/** Core user fields from Google OAuth. */
export interface IUser {
  googleId: string;
  email: string;
  name: string;
}

/** User as a Mongoose document. */
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

/** Payload extracted from a Google ID token. */
export interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
}

/** Payload encoded inside a JWT issued by this server. */
export interface JwtPayload {
  userId: string;
}

/** Response returned after successful Google authentication. */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
