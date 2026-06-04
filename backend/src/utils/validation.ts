// Third-party Libraries
import { body, param } from "express-validator";

// Internal Modules
import { ValidationLimit } from "@/constants/validation";

/** Validate that :id is a valid MongoDB ObjectId. */
export const mongoIdRule = param("id")
  .isMongoId()
  .withMessage("Invalid todo ID");

/** Validate the title field — required, max 200 characters. */
export const titleRule = body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required")
  .isLength({ max: ValidationLimit.TITLE_MAX_LENGTH })
  .withMessage(
    `Title cannot exceed ${ValidationLimit.TITLE_MAX_LENGTH} characters`,
  );

/** Validate the description field — optional, max 1000 characters. */
export const descriptionRule = body("description")
  .optional()
  .trim()
  .isLength({ max: ValidationLimit.DESCRIPTION_MAX_LENGTH })
  .withMessage(
    `Description cannot exceed ${ValidationLimit.DESCRIPTION_MAX_LENGTH} characters`,
  );
