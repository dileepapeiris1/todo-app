import { useInfiniteQuery } from '@tanstack/react-query';

import { PAGE_SIZE, QUERY_KEYS } from '@/constants/api';
import { api } from '@/services/api';
import { SortField, SortOrder } from '@/types/sorting';
import type { Paginated } from '@/types/pagination';
import type { Todo } from '@/types/todo';

/**
 * Fetches one page of todos from the server.
 * Handles both the legacy flat-array response and the current paginated shape.
 *
 * @param {number} offset - Number of records to skip.
 * @param {SortField} sortBy - Field to sort by.
 * @param {SortOrder} sortOrder - Sort direction.
 * @returns {Promise<Paginated<Todo>>} One page of todos with total count.
 */
export async function fetchTodosPage(
  offset: number,
  sortBy: SortField,
  sortOrder: SortOrder,
): Promise<Paginated<Todo>> {
  const raw = await api.get<Paginated<Todo> | Todo[]>(
    '/api/v1/todos?offset=' + offset + '&limit=' + PAGE_SIZE + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder
  );
  if (Array.isArray(raw)) {
    return { data: raw, total: raw.length, offset, limit: PAGE_SIZE };
  }
  return raw;
}

/**
 * Infinite-scroll query for the todo list.
 * Key starts with QUERY_KEYS.all so any todo mutation invalidates and refetches all loaded pages.
 *
 * @param {SortField} sortBy - Field to sort by.
 * @param {SortOrder} sortOrder - Sort direction.
 * @returns {UseInfiniteQueryResult} Paginated result; flatten with data.pages.flatMap(p => p.data).
 */
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

/**
 * Fetches one page of search results (plain async, not cached).
 *
 * @param {string} searchQuery - The search term.
 * @param {number} offset - Number of records to skip.
 * @returns {Promise<Paginated<Todo>>} A single page of matching todos.
 */
export async function fetchSearchPage(
  searchQuery: string,
  offset: number,
): Promise<Paginated<Todo>> {
  return api.post<Paginated<Todo>>('/api/v1/todos/search', {
    searchQuery,
    offset,
    limit: PAGE_SIZE,
  });
}
