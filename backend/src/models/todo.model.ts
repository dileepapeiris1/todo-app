// Third-party Libraries
import mongoose, { Model, Schema } from "mongoose";

// Internal Modules
import { ModelName } from "@/constants/models";
import { ValidationLimit } from "@/constants/validation";
import { ITodo, ITodoDocument } from "@/types/todo";

/** Mongoose schema for a todo. */
const todoSchema = new Schema<ITodoDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.USER,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [
        ValidationLimit.TITLE_MAX_LENGTH,
        `Title cannot exceed ${ValidationLimit.TITLE_MAX_LENGTH} characters`,
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        ValidationLimit.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${ValidationLimit.DESCRIPTION_MAX_LENGTH} characters`,
      ],
      default: "",
    },
    done: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

/** Todo model */
const Todo: Model<ITodoDocument> = mongoose.model<ITodoDocument>(
  ModelName.TODO,
  todoSchema,
);
export default Todo;
