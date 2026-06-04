// Third-party Libraries
import { ParamsDictionary } from "express-serve-static-core";

/** Body for POST /api/todos */
export interface CreateTodoBody {
  title: string;
  description?: string;
  dueDate?: string;
}

/** Body for PUT /api/todos/:id */
export interface UpdateTodoBody {
  title: string;
  description?: string;
  dueDate?: string;
}

/** Body for POST /api/todos/search */
export interface SearchTodoBody {
  searchQuery: string;
  offset?: number;
  limit?: number;
}

/** Route params for endpoints that require an :id. */
export interface TodoIdParam extends ParamsDictionary {
  id: string;
}

/**
 * Extends Express Request so the authenticate middleware can attach
 * the authenticated userId and it flows through to controllers.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
