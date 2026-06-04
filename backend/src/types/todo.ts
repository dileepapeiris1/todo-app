// Third-party Libraries
import { Document, Types } from "mongoose";

/**
 * Core todo fields — TypeScript only, compile-time.
 * Used as the base for both the Mongoose schema and the document interface.
 */
export interface ITodo {
  userId: Types.ObjectId;
  title: string;
  description: string;
  done: boolean;
  dueDate?: Date;
}

/**
 * Bridges TypeScript types and Mongoose at runtime.
 * Extends ITodo with Mongoose Document methods like save(), _id, createdAt, updatedAt.
 */
export interface ITodoDocument extends ITodo, Document {
  createdAt: Date;
  updatedAt: Date;
}
