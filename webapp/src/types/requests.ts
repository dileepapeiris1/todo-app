import type { ISODateString } from '@/types/common';

/** Body for POST /api/v1/todos */
export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: ISODateString;
}

/** Body for PUT /api/v1/todos/:id */
export interface UpdateTodoRequest {
  title: string;
  description?: string;
  dueDate?: ISODateString;
}

/** Body for POST /api/v1/todos/search */
export interface SearchTodosRequest {
  searchQuery: string;
  offset?: number;
  limit?: number;
}
