/** Standard paginated API response shape. */
export interface Paginated<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

/** Common offset-based pagination query parameters. */
export interface PaginationParams {
  offset: number;
  limit: number;
}
