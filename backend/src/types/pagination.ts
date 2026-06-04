/** Generic paginated API response using offset-based pagination. */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}
