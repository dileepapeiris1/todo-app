// Internal Modules
import { ErrorMessage } from "@/constants/errors";
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from "@/constants/pagination";
import Todo from "@/models/todo.model";
import { PaginatedResult } from "@/types/pagination";
import { SortBy, SortOrder } from "@/types/sort";
import { ITodoDocument } from "@/types/todo";
import { CreateTodoBody, UpdateTodoBody } from "@/types/request";
import logger from "@/utils/logger";

/**
 * Get a paginated, sorted list of todos for a user.
 * @param userId    - authenticated user id
 * @param offset    - number of records to skip
 * @param limit     - max records to return
 * @param sortBy    - field to sort on (createdAt | dueDate | title)
 * @param sortOrder - sort direction (asc | desc)
 * @returns paginated result with data and total count
 */
export async function findAllTodos(
  userId: string,
  offset: number       = DEFAULT_PAGINATION_OFFSET,
  limit: number        = DEFAULT_PAGINATION_LIMIT,
  sortBy: SortBy       = "createdAt",
  sortOrder: SortOrder = "desc",
): Promise<PaginatedResult<ITodoDocument>> {
  logger.debug(`Service: findAllTodos — userId=${userId} offset=${offset} limit=${limit} sortBy=${sortBy} sortOrder=${sortOrder}`);
  const sortDir: 1 | -1 = sortOrder === "asc" ? 1 : -1;
  const [data, total] = await Promise.all([
    Todo.find({ userId }).sort({ [sortBy]: sortDir }).skip(offset).limit(limit),
    Todo.countDocuments({ userId }),
  ]);
  logger.debug(`Service: findAllTodos → ${data.length} of ${total} item(s)`);
  return { data, total, offset, limit };
}

/**
 * Search todos by title or description (case-insensitive) with offset pagination.
 * @param userId      - authenticated user id
 * @param searchQuery - search term (regex-escaped before use)
 * @param offset      - number of records to skip
 * @param limit       - max records to return
 * @returns paginated result with matched data and total count
 */
export async function searchTodos(
  userId: string,
  searchQuery: string,
  offset: number = DEFAULT_PAGINATION_OFFSET,
  limit: number  = DEFAULT_PAGINATION_LIMIT,
): Promise<PaginatedResult<ITodoDocument>> {
  logger.debug(`Service: searchTodos — userId=${userId} searchQuery="${searchQuery}" offset=${offset} limit=${limit}`);
  const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex   = new RegExp(escaped, "i");
  const filter  = { userId, $or: [{ title: regex }, { description: regex }] };
  const [data, total] = await Promise.all([
    Todo.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit),
    Todo.countDocuments(filter),
  ]);
  logger.debug(`Service: searchTodos → ${data.length} of ${total} result(s)`);
  return { data, total, offset, limit };
}

/**
 * Create a new todo for a user.
 * @param userId - authenticated user id
 * @param data   - title, optional description, optional dueDate
 * @returns the created todo document
 */
export async function createTodo(
  userId: string,
  data: CreateTodoBody,
): Promise<ITodoDocument> {
  logger.debug(`Service: createTodo — userId=${userId} title="${data.title}"`);
  const payload: Record<string, unknown> = { userId, title: data.title };
  if (data.description) payload.description = data.description;
  if (data.dueDate)     payload.dueDate     = new Date(data.dueDate);
  const todo = await Todo.create(payload);
  logger.debug(`Service: createTodo → created id=${todo._id}`);
  return todo;
}

/**
 * Update a todo's title, description, and/or due date.
 * @param userId - authenticated user id
 * @param id     - todo id
 * @param data   - fields to update
 * @returns the updated todo document
 * @throws if todo not found
 */
export async function updateTodo(
  userId: string,
  id: string,
  data: UpdateTodoBody,
): Promise<ITodoDocument> {
  logger.debug(`Service: updateTodo — userId=${userId} id=${id}`);
  const update: Record<string, unknown> = { title: data.title };
  if (data.description !== undefined) update.description = data.description;
  if (data.dueDate !== undefined)     update.dueDate     = data.dueDate ? new Date(data.dueDate) : null;
  const todo = await Todo.findOneAndUpdate({ _id: id, userId }, update, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw new Error(ErrorMessage.TODO_NOT_FOUND);
  logger.debug(`Service: updateTodo → updated id=${id}`);
  return todo;
}

/**
 * Toggle the done status of a todo.
 * @param userId - authenticated user id
 * @param id     - todo id
 * @returns the updated todo document
 * @throws if todo not found
 */
export async function toggleDone(
  userId: string,
  id: string,
): Promise<ITodoDocument> {
  logger.debug(`Service: toggleDone — userId=${userId} id=${id}`);
  const todo = await Todo.findOne({ _id: id, userId });
  if (!todo) throw new Error(ErrorMessage.TODO_NOT_FOUND);

  // Block marking as done if the task is scheduled for a future date
  if (!todo.done && todo.dueDate && todo.dueDate > new Date()) {
    throw new Error("Cannot complete a task that is scheduled for a future date");
  }

  todo.done = !todo.done;
  const saved = await todo.save();
  logger.debug(`Service: toggleDone → id=${id} done=${saved.done}`);
  return saved;
}

/**
 * Delete a todo permanently.
 * @param userId - authenticated user id
 * @param id     - todo id
 * @throws if todo not found
 */
export async function deleteTodo(userId: string, id: string): Promise<void> {
  logger.debug(`Service: deleteTodo — userId=${userId} id=${id}`);
  const todo = await Todo.findOneAndDelete({ _id: id, userId });
  if (!todo) throw new Error(ErrorMessage.TODO_NOT_FOUND);
  logger.debug(`Service: deleteTodo → deleted id=${id}`);
}
