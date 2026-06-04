import { SortField, SortOrder } from '@/types/sorting';

export const PAGE_SIZE  = 10;
export const LOAD_LIMIT = 50;

export const QUERY_KEYS = {
  all: ['todos'] as const,

  list(sortBy: SortField, sortOrder: SortOrder) {
    return ['todos', 'list', sortBy, sortOrder] as const;
  },

  search(searchQuery: string, offset: number) {
    return ['todos', 'search', searchQuery, offset] as const;
  },
};
