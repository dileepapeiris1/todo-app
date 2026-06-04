import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/api';
import { API_URL } from '@/constants/config';
import { useLogger } from '@/providers/LoggerProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { api } from '@/services/api';
import { SnackType } from '@/types/snack';
import type { CreateTodoRequest, UpdateTodoRequest } from '@/types/requests';
import type { Todo } from '@/types/todo';

function useInvalidate() {
  const qc = useQueryClient();
  return useCallback(
    () => qc.invalidateQueries({ queryKey: QUERY_KEYS.all }),
    [qc],
  );
}

export function useAddTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) =>
      api.post<Todo>(`${API_URL}/api/v1/todos`, data),
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

export function useUpdateTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      api.put<Todo>(`${API_URL}/api/v1/todos/${id}`, data),
    onSuccess: (todo) => {
      logger.info('Todo updated', todo._id);
      showSnack('Task updated', SnackType.Success);
      invalidate();
    },
    onError: (e) => {
      logger.error('Update todo failed', e);
      showSnack((e as Error).message, SnackType.Error);
    },
  });
}

export function useToggleTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (todo: Todo) => {
      if (!todo.done && todo.dueDate && new Date(todo.dueDate) > new Date()) {
        return Promise.reject(new Error('Cannot complete a task scheduled for a future date'));
      }
      return api.patch<Todo>(`${API_URL}/api/v1/todos/${todo._id}/done`);
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

export function useDeleteTodo() {
  const invalidate    = useInvalidate();
  const { showSnack } = useSnackbar();
  const logger        = useLogger();

  return useMutation({
    mutationFn: (id: string) => api.delete(`${API_URL}/api/v1/todos/${id}`),
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
