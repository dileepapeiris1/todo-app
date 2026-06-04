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

/** Validate dueDate — optional ISO 8601 datetime, must be in the future. */
export const dueDateRule = body("dueDate")
  .optional({ values: "falsy" })
  .isISO8601()
  .withMessage("dueDate must be a valid ISO 8601 date")
  .custom((value: string) => {
    if (new Date(value) <= new Date()) {
      throw new Error("dueDate must be a future date and time");
    }
    return true;
  });

/** Validate search query — required, max 200 chars. */
export const searchQueryRule = body("query")
  .trim()
  .notEmpty()
  .withMessage("Search query is required")
  .isLength({ max: 200 })
  .withMessage("Search query cannot exceed 200 characters");

/** Validate offset in POST body — must be zero or greater. */
export const offsetBodyRule = body("offset")
  .optional()
  .isInt({ min: 0 })
  .withMessage("offset must be a non-negative integer")
  .toInt();

/** Validate limit in POST body. */
export const limitBodyRule = body("limit")
  .optional()
  .isInt({ min: 1, max: 100 })
  .withMessage("limit must be between 1 and 100")
  .toInt();
