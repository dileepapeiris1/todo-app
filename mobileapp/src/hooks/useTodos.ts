/** TanStack Query hooks for fetching todos in the mobile app. */

import { useInfiniteQuery } from '@tanstack/react-query';
import { LOAD_LIMIT, PAGE_SIZE, QUERY_KEYS } from '@/constants/api';
import { API_URL } from '@/constants/config';
import { api, ApiError } from '@/services/api';
import { SortField, SortOrder } from '@/types/sorting';
import type { Paginated } from '@/types/pagination';
import type { SearchTodosRequest } from '@/types/requests';
import type { Todo } from '@/types/todo';

export async function fetchTodosPage(
  offset: number,
  sortBy: SortField,
  sortOrder: SortOrder,
): Promise<Paginated<Todo>> {
  const url = `${API_URL}/api/v1/todos?offset=${offset}&limit=${PAGE_SIZE}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const raw = await api.get<Paginated<Todo> | Todo[]>(url);
  if (Array.isArray(raw)) {
    return { data: raw, total: raw.length, offset, limit: PAGE_SIZE };
  }
  return raw;
}

export function useInfiniteTodos(sortBy: SortField, sortOrder: SortOrder) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.all, 'infinite', sortBy, sortOrder] as const,
    queryFn: ({ pageParam }) =>
      fetchTodosPage(pageParam as number, sortBy, sortOrder),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
    initialPageParam: 0,
  });
}

export async function fetchSearchPage(
  searchQuery: string,
  offset: number,
): Promise<Paginated<Todo>> {
  return api.post<Paginated<Todo>>(`${API_URL}/api/v1/todos/search`, {
    searchQuery,
    offset,
    limit: PAGE_SIZE,
  });
}

export function getErrorStatus(error: unknown): number {
  return error instanceof ApiError ? error.status : 500;
}
