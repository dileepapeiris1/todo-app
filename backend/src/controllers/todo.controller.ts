// Third-party Libraries
import { RequestHandler } from "express";

// Internal Modules
import { ErrorMessage } from "@/constants/errors";
import { HttpStatus } from "@/constants/http";
import { VALID_SORT_BY, VALID_SORT_ORDER } from "@/constants/sort";
import * as todoService from "@/services/service";
import { PaginatedResult } from "@/types/pagination";
import { ITodoDocument } from "@/types/todo";
import { ErrorResponse } from "@/types/error";
import { SortBy, SortOrder } from "@/types/sort";
import { CreateTodoBody, SearchTodoBody, TodoIdParam, UpdateTodoBody } from "@/types/request";

/** GET /api/v1/todos?offset=0&limit=10&sortBy=createdAt&sortOrder=desc */
export const getAllTodos: RequestHandler<
  {},
  PaginatedResult<ITodoDocument> | ErrorResponse
> = async (req, res, next): Promise<void> => {
  try {
    const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const sortBy: SortBy       = VALID_SORT_BY.includes(req.query.sortBy as SortBy)
      ? (req.query.sortBy as SortBy)
      : "createdAt";
    const sortOrder: SortOrder = VALID_SORT_ORDER.includes(req.query.sortOrder as SortOrder)
      ? (req.query.sortOrder as SortOrder)
      : "desc";
    const result = await todoService.findAllTodos(req.userId!, offset, limit, sortBy, sortOrder);
    res.status(HttpStatus.OK).json(result);
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/todos/search — search todos by title/description with offset pagination. */
export const searchTodos: RequestHandler<
  {},
  PaginatedResult<ITodoDocument> | ErrorResponse,
  SearchTodoBody
> = async (req, res, next): Promise<void> => {
  try {
    const { searchQuery, offset = 0, limit = 10 } = req.body;
    const result = await todoService.searchTodos(req.userId!, searchQuery, offset, limit);
    res.status(HttpStatus.OK).json(result);
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/todos — create a todo for the authenticated user. */
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

/** PUT /api/v1/todos/:id — update title, description, and due date. */
export const updateTodo: RequestHandler<
  TodoIdParam,
  ITodoDocument | ErrorResponse,
  UpdateTodoBody
> = async (req, res, next): Promise<void> => {
  try {
    const todo = await todoService.updateTodo(req.userId!, req.params.id, req.body);
    res.status(HttpStatus.OK).json(todo);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === ErrorMessage.TODO_NOT_FOUND) {
      res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
      return;
    }
    next(err);
  }
};

/** PATCH /api/v1/todos/:id/done — toggle done status. */
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

/** DELETE /api/v1/todos/:id — delete a todo. */
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
