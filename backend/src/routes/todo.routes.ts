// Third-party Libraries
import { Router, type IRouter } from "express";

// Internal Modules
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  searchTodos,
  toggleDone,
  updateTodo,
} from "@/controllers/todo.controller";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/requestValidator";
import {
  descriptionRule,
  dueDateRule,
  limitBodyRule,
  mongoIdRule,
  offsetBodyRule,
  searchQueryRule,
  titleRule,
} from "@/utils/validation";

/** Todo routes — all protected by JWT authentication. */
const router: IRouter = Router();

router.use(authenticate);

// Search must be declared before /:id to avoid route param capture
router.post("/search", [searchQueryRule, offsetBodyRule, limitBodyRule], validate, searchTodos);

router.get("/", getAllTodos);
router.post("/", [titleRule, descriptionRule, dueDateRule], validate, createTodo);
router.put("/:id", [mongoIdRule, titleRule, descriptionRule, dueDateRule], validate, updateTodo);
router.patch("/:id/done", [mongoIdRule], validate, toggleDone);
router.delete("/:id", [mongoIdRule], validate, deleteTodo);

export default router;
