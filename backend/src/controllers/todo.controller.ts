// Third-party Libraries
import { RequestHandler } from "express";

// Internal Modules
import { ErrorMessage } from "@/constants/errors";
import { HttpStatus } from "@/constants/http";
import * as todoService from "@/services/service";
import { ITodoDocument } from "@/types/todo";
import { ErrorResponse } from "@/types/error";
import { CreateTodoBody, TodoIdParam, UpdateTodoBody } from "@/types/request";

/** GET /api/todos — get all todos for the authenticated user. */
export const getAllTodos: RequestHandler<
  {},
  ITodoDocument[] | ErrorResponse
> = async (req, res, next): Promise<void> => {
  try {
    const todos = await todoService.findAllTodos(req.userId!);
    res.status(HttpStatus.OK).json(todos);
  } catch (err) {
    next(err);
  }
};

/** POST /api/todos — create a todo for the authenticated user. */
export const createTodo: RequestHandler<
  {},
  ITodoDocument | ErrorResponse,
  CreateTodoBody
> = async (req, res, next): Promise<void> => {
  try {
    const todo = await todoService.createTodo(req.userId!, req.body);
    res.status(HttpStatus.CREATED).json(todo);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/todos/:id — update title and description. */
export const updateTodo: RequestHandler<
  TodoIdParam,
  ITodoDocument | ErrorResponse,
  UpdateTodoBody
> = async (req, res, next): Promise<void> => {
  try {
    const todo = await todoService.updateTodo(
      req.userId!,
      req.params.id,
      req.body,
    );
    res.status(HttpStatus.OK).json(todo);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === ErrorMessage.TODO_NOT_FOUND) {
      res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
      return;
    }
    next(err);
  }
};

/** PATCH /api/todos/:id/done — toggle done status. */
export const toggleDone: RequestHandler<
  TodoIdParam,
  ITodoDocument | ErrorResponse
> = async (req, res, next): Promise<void> => {
  try {
    const todo = await todoService.toggleDone(req.userId!, req.params.id);
    res.status(HttpStatus.OK).json(todo);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === ErrorMessage.TODO_NOT_FOUND) {
      res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
      return;
    }
    next(err);
  }
};

/** DELETE /api/todos/:id — delete a todo. */
export const deleteTodo: RequestHandler<
  TodoIdParam,
  { message: string } | ErrorResponse
> = async (req, res, next): Promise<void> => {
  try {
    await todoService.deleteTodo(req.userId!, req.params.id);
    res.status(HttpStatus.OK).json({ message: "Todo deleted successfully" });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === ErrorMessage.TODO_NOT_FOUND) {
      res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
      return;
    }
    next(err);
  }
};
