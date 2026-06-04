import { SortField, SortOrder } from '@/types/sorting';
import { fmtDateLabel } from '@/utils/date';
import type { Todo } from '@/types/todo';

export interface DateGroup {
  label: string;
  items: Todo[];
}

/**
 * Compares two todos by title for alphabetical sorting.
 *
 * @param {Todo} todo1 - First todo.
 * @param {Todo} todo2 - Second todo.
 * @param {SortOrder} order - Sort direction.
 * @returns {number} Negative, zero, or positive comparison result.
 */
function compareByTitle(todo1: Todo, todo2: Todo, order: SortOrder): number {
  const comparison = todo1.title.toLowerCase().localeCompare(todo2.title.toLowerCase());
  if (order === SortOrder.Asc) {
    return comparison;
  }
  return -comparison;
}

/**
 * Compares two todos by due date, treating missing due dates as epoch zero.
 *
 * @param {Todo} todo1 - First todo.
 * @param {Todo} todo2 - Second todo.
 * @param {SortOrder} order - Sort direction.
 * @returns {number} Negative, zero, or positive comparison result.
 */
function compareByDueDate(todo1: Todo, todo2: Todo, order: SortOrder): number {
  const date1 = todo1.dueDate ? new Date(todo1.dueDate).getTime() : 0;
  const date2 = todo2.dueDate ? new Date(todo2.dueDate).getTime() : 0;
  if (order === SortOrder.Asc) {
    return date1 - date2;
  }
  return date2 - date1;
}

/**
 * Compares two todos by their creation date.
 *
 * @param {Todo} todo1 - First todo.
 * @param {Todo} todo2 - Second todo.
 * @param {SortOrder} order - Sort direction.
 * @returns {number} Negative, zero, or positive comparison result.
 */
function compareByCreatedAt(todo1: Todo, todo2: Todo, order: SortOrder): number {
  const date1 = new Date(todo1.createdAt).getTime();
  const date2 = new Date(todo2.createdAt).getTime();
  if (order === SortOrder.Asc) {
    return date1 - date2;
  }
  return date2 - date1;
}

/**
 * Returns the ISO string used as the grouping key for a todo.
 * Uses dueDate when sorting by due date, otherwise uses createdAt.
 *
 * @param {Todo} todo - The todo item.
 * @param {SortField} by - The active sort field.
 * @returns {string} ISO datetime string used as the group key.
 */
function getGroupDateKey(todo: Todo, by: SortField): string {
  if (by === SortField.DueDate) {
    return todo.dueDate ?? todo.createdAt;
  }
  return todo.createdAt;
}

/**
 * Groups todos into dated sections, respecting the chosen sort field and direction.
 * When sorting by Title, returns a single flat group sorted alphabetically.
 *
 * @param {Todo[]} todos - The list of todos to group.
 * @param {SortField} by - Field to sort and group by.
 * @param {SortOrder} order - Sort direction.
 * @returns {DateGroup[]} Array of date groups, each with a label and todo items.
 */
export function groupByDate(
  todos: Todo[],
  by: SortField = SortField.CreatedAt,
  order: SortOrder = SortOrder.Desc,
): DateGroup[] {
  let sorted: Todo[];

  switch (by) {
    case SortField.Title:
      sorted = [...todos].sort((todo1, todo2) => compareByTitle(todo1, todo2, order));
      return [{ label: 'All Tasks', items: sorted }];

    case SortField.DueDate:
      sorted = [...todos].sort((todo1, todo2) => compareByDueDate(todo1, todo2, order));
      break;

    default:
      sorted = [...todos].sort((todo1, todo2) => compareByCreatedAt(todo1, todo2, order));
  }

  const groups: DateGroup[] = [];

  for (const todo of sorted) {
    const dateKey   = getGroupDateKey(todo, by);
    const label     = fmtDateLabel(dateKey);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(todo);
    } else {
      groups.push({ label, items: [todo] });
    }
  }

  return groups;
}
