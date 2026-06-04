// Internal Modules
import { ErrorMessage } from "@/constants/errors";
import Todo from "@/models/todo.model";
import { ITodoDocument } from "@/types/todo";
import { CreateTodoBody, UpdateTodoBody } from "@/types/request";
import logger from "@/utils/logger";

/**
 * Get all todos for a user sorted by newest first.
 * @param userId - authenticated user id
 * @returns array of todo documents
 */
export async function findAllTodos(userId: string): Promise<ITodoDocument[]> {
  logger.debug(`Service: findAllTodos — userId=${userId}`);
  const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
  logger.debug(`Service: findAllTodos → returned ${todos.length} item(s)`);
  return todos;
}

/**
 * Create a new todo for a user.
 * @param userId - authenticated user id
 * @param data - title and optional description
 * @returns the created todo document
 */
export async function createTodo(
  userId: string,
  data: CreateTodoBody,
): Promise<ITodoDocument> {
  logger.debug(`Service: createTodo — userId=${userId} title="${data.title}"`);
  const todo = await Todo.create({ ...data, userId });
  logger.debug(`Service: createTodo → created id=${todo._id}`);
  return todo;
}

/**
 * Update a todo's title and description.
 * @param userId - authenticated user id
 * @param id - todo id
 * @param data - fields to update
 * @returns the updated todo document
 * @throws if todo not found
 */
export async function updateTodo(
  userId: string,
  id: string,
  data: UpdateTodoBody,
): Promise<ITodoDocument> {
  logger.debug(`Service: updateTodo — userId=${userId} id=${id}`);
  const todo = await Todo.findOneAndUpdate({ _id: id, userId }, data, {
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
 * @param id - todo id
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
  todo.done = !todo.done;
  const saved = await todo.save();
  logger.debug(`Service: toggleDone → id=${id} done=${saved.done}`);
  return saved;
}

/**
 * Delete a todo permanently.
 * @param userId - authenticated user id
 * @param id - todo id
 * @throws if todo not found
 */
export async function deleteTodo(userId: string, id: string): Promise<void> {
  logger.debug(`Service: deleteTodo — userId=${userId} id=${id}`);
  const todo = await Todo.findOneAndDelete({ _id: id, userId });
  if (!todo) throw new Error(ErrorMessage.TODO_NOT_FOUND);
  logger.debug(`Service: deleteTodo → deleted id=${id}`);
}
