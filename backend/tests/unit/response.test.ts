// Third-party Libraries
import { validationResult } from "express-validator";
import { Request } from "express";

// Internal Modules
import { toValidationErrorResponse } from "@/utils/response";

/** Unit tests for the toValidationErrorResponse utility. */
describe("toValidationErrorResponse", () => {
  /** Returns an empty errors array when no validation errors exist. */
  it("returns an empty errors array when there are no errors", () => {
    const req = { body: {} } as Request;
    const result = validationResult(req);

    const response = toValidationErrorResponse(result);

    expect(response.errors).toHaveLength(0);
  });

  /** Wraps the error array inside the expected ValidationErrorResponse shape. */
  it("wraps the error array in the expected shape", () => {
    const response = toValidationErrorResponse({
      array: () => [
        {
          msg: "Title is required",
          path: "title",
          location: "body",
          value: "",
        },
      ],
      isEmpty: () => false,
    } as any);

    expect(response).toHaveProperty("errors");
    expect(response.errors[0].msg).toBe("Title is required");
    expect(response.errors[0].path).toBe("title");
  });
});
