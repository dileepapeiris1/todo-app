import { SortField, SortOrder } from '@/types/sorting';

/** Number of todos fetched per page (both main views and search). */
export const PAGE_SIZE = 10;

// Sort select options
export const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: SortField.CreatedAt, label: 'Date Created' },
  { value: SortField.DueDate,   label: 'Due Date' },
  { value: SortField.Title,     label: 'Title' },
];

// TanStack Query key factories
export const QUERY_KEYS = {
  /** Base key — invalidate this to refetch all todo queries. */
  all: ['todos'] as const,

  /** Key for the sorted, paginated todo list. */
  list(sortBy: SortField, sortOrder: SortOrder) {
    return ['todos', 'list', sortBy, sortOrder] as const;
  },

  /** Key for search results at a given query and offset. */
  search(searchQuery: string, offset: number) {
    return ['todos', 'search', searchQuery, offset] as const;
  },
};
