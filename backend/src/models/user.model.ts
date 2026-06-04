// Third-party Libraries
import mongoose, { Model, Schema } from "mongoose";

// Internal Modules
import { ModelName } from "@/constants/models";
import { IUserDocument } from "@/types/user";

/** Mongoose schema for a user. */
const userSchema = new Schema<IUserDocument>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

/** User model. */
const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  ModelName.USER,
  userSchema,
);
export default User;
