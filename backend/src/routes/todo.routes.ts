// Third-party Libraries
import { Router } from "express";

// Internal Modules
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  toggleDone,
  updateTodo,
} from "@/controllers/todo.controller";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/requestValidator";
import { descriptionRule, mongoIdRule, titleRule } from "@/utils/validation";

/** Todo routes — all protected by JWT authentication. */
const router = Router();

router.use(authenticate);

router.get("/", getAllTodos);
router.post("/", [titleRule, descriptionRule], validate, createTodo);
router.put(
  "/:id",
  [mongoIdRule, titleRule, descriptionRule],
  validate,
  updateTodo,
);
router.patch("/:id/done", [mongoIdRule], validate, toggleDone);
router.delete("/:id", [mongoIdRule], validate, deleteTodo);

export default router;
