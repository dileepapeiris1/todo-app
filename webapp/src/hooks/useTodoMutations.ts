import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { useLogger } from '@/providers/LoggerProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { api } from '@/services/api';
import { SnackType } from '@/types/snack';
import type { CreateTodoRequest, UpdateTodoRequest } from '@/types/requests';
import type { Todo } from '@/types/todo';

/**
 * Returns a function that invalidates all todo queries,
 * triggering a background refetch after any mutation.
 *
 * @returns {() => void} Invalidation function.
 */
function useInvalidate() {
  const qc = useQueryClient();
  // useCallback ensures the returned function reference is stable across renders
  return useCallback(
    () => qc.invalidateQueries({ queryKey: QUERY_KEYS.all }),
    [qc],
  );
}

/**
 * Mutation hook for creating a new todo.
 *
 * @returns {UseMutationResult<Todo, Error, CreateTodoRequest>} Mutation result.
 */
export function useAddTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => api.post<Todo>('/api/v1/todos', data),
    onSuccess: (todo) => {
      logger.info('Todo added', todo._id);
      showSnack('Task added successfully', SnackType.Success);
      invalidate();
    },
    onError: (e) => {
      logger.error('Add todo failed', e);
      showSnack((e as Error).message, SnackType.Error);
    },
  });
}

/**
 * Mutation hook for updating a todo's title, description, and due date.
 *
 * @returns {UseMutationResult<Todo, Error, { id: string; data: UpdateTodoRequest }>} Mutation result.
 */
export function useUpdateTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      api.put<Todo>(`/api/v1/todos/${id}`, data),
    onSuccess: (todo) => {
      logger.info('Todo updated', todo._id);
      showSnack('Task updated successfully', SnackType.Success);
      invalidate();
    },
    onError: (e) => {
      logger.error('Update todo failed', e);
      showSnack((e as Error).message, SnackType.Error);
    },
  });
}

/**
 * Mutation hook for toggling a todo's done status.
 * Rejects the mutation if the todo is scheduled for a future date.
 *
 * @returns {UseMutationResult<Todo, Error, Todo>} Mutation result.
 */
export function useToggleTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (todo: Todo) => {
      // Business rule: future-dated tasks cannot be marked complete
      if (!todo.done && todo.dueDate && new Date(todo.dueDate) > new Date()) {
        return Promise.reject(
          new Error('Cannot complete a task scheduled for a future date')
        );
      }
      return api.patch<Todo>(`/api/v1/todos/${todo._id}/done`);
    },
    onSuccess: (_, todo) => {
      const msg = todo.done ? 'Task marked as incomplete' : 'Task marked as complete';
      logger.info(msg, todo._id);
      showSnack(msg, SnackType.Success);
      invalidate();
    },
    onError: (e) => {
      logger.error('Toggle todo failed', e);
      showSnack((e as Error).message, SnackType.Error);
    },
  });
}

/**
 * Mutation hook for permanently deleting a todo.
 *
 * @returns {UseMutationResult<{ message: string }, Error, string>} Mutation result.
 */
export function useDeleteTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/todos/${id}`),
    onSuccess: (_, id) => {
      logger.info('Todo deleted', id);
      showSnack('Task deleted', SnackType.Success);
      invalidate();
    },
    onError: (e) => {
      logger.error('Delete todo failed', e);
      showSnack((e as Error).message, SnackType.Error);
    },
  });
}
