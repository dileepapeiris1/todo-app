// Third-party Libraries
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Internal Modules
import { HttpStatus } from "@/constants/http";
import { ErrorResponse } from "@/types/error";
import { JwtPayload } from "@/types/user";

/**
 * Verifies the Bearer JWT in the Authorization header.
 * @param req - Express request object (sets req.userId on success)
 * @param res - Express response object
 * @param next - Express next function
 * @returns 401 if the token is missing or invalid
 */
export const authenticate: RequestHandler = (req, res, next): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "No token provided" } as ErrorResponse);
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server misconfiguration" } as ErrorResponse);
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" } as ErrorResponse);
  }
};
