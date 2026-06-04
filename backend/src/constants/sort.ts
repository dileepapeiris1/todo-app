import { SortBy, SortOrder } from "@/types/sort";

/** Allowed sort field values accepted as query parameters. */
export const VALID_SORT_BY: SortBy[] = ["createdAt", "dueDate", "title"];

/** Allowed sort direction values accepted as query parameters. */
export const VALID_SORT_ORDER: SortOrder[] = ["asc", "desc"];
