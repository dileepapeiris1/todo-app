// Third-party Libraries
import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

// Internal Modules
import { JWT_EXPIRES_IN } from "@/constants/auth";
import { HttpStatus } from "@/constants/http";
import User from "@/models/user.model";
import { AuthResponse } from "@/types/user";
import { ErrorResponse } from "@/types/error";
import logger from "@/utils/logger";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleSignInBody {
  credential: string;
}

/**
 * POST /auth/google
 * Verifies a Google ID token, finds or creates the user, and returns a JWT.
 * @param req - Express request object (body: { credential })
 * @param res - Express response object
 * @param next - Express next function
 * @returns 200 with token and user, 400 if credential missing, 401 if token invalid
 */
export const googleSignIn: RequestHandler<
  {},
  AuthResponse | ErrorResponse,
  GoogleSignInBody
> = async (req, res, next): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Google credential is required" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error("JWT_SECRET is not set in environment variables");
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server misconfiguration: missing JWT_SECRET" });
      return;
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      logger.error("GOOGLE_CLIENT_ID is not set in environment variables");
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server misconfiguration: missing GOOGLE_CLIENT_ID" });
      return;
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyErr) {
      logger.error("Google token verification failed", {
        error: (verifyErr as Error).message,
      });
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          message:
            "Google token verification failed: " + (verifyErr as Error).message,
        });
      return;
    }

    const payload = ticket?.getPayload();
    if (!payload?.sub) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Google token payload" });
      return;
    }

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email ?? "",
        name: payload.name ?? "",
      });
      logger.info(`New user created: ${user.email}`);
    }

    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    logger.info(`User signed in: ${user.email}`);

    res.status(HttpStatus.OK).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    logger.error("Unexpected error in googleSignIn", {
      error: (err as Error).message,
    });
    next(err);
  }
};
