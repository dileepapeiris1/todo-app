/** Tests for the groupByDate utility. */

import { describe, it, expect } from 'vitest';
import { groupByDate } from '@/utils/group';
import { SortField, SortOrder } from '@/types/sorting';
import type { Todo } from '@/types/todo';

function t(id: string, title: string, createdAt: string, done = false): Todo {
  return { _id: id, title, description: '', done, createdAt };
}

const todos: Todo[] = [
  t('1', 'Apple',  '2026-06-04T10:00:00.000Z'),
  t('2', 'Banana', '2026-06-03T09:00:00.000Z'),
  t('3', 'Cherry', '2026-06-04T11:00:00.000Z'),
];

describe('groupByDate — Title sort', () => {
  it('returns exactly one group labelled "All Tasks"', () => {
    const groups = groupByDate(todos, SortField.Title, SortOrder.Asc);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('All Tasks');
  });

  it('sorts items alphabetically ascending', () => {
    const titles = groupByDate(todos, SortField.Title, SortOrder.Asc)[0].items.map(i => i.title);
    expect(titles).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('sorts items alphabetically descending', () => {
    const titles = groupByDate(todos, SortField.Title, SortOrder.Desc)[0].items.map(i => i.title);
    expect(titles).toEqual(['Cherry', 'Banana', 'Apple']);
  });
});

describe('groupByDate — CreatedAt sort', () => {
  it('groups todos from the same calendar date together', () => {
    const groups = groupByDate(todos, SortField.CreatedAt, SortOrder.Desc);
    const june4  = groups.find(g => g.items.some(i => i._id === '1'));
    expect(june4?.items).toHaveLength(2);
  });

  it('newest-first group appears first when descending', () => {
    const groups = groupByDate(todos, SortField.CreatedAt, SortOrder.Desc);
    const ids    = groups[0].items.map(i => i._id);
    expect(ids).toContain('1');
    expect(ids).toContain('3');
  });

  it('oldest-first group appears first when ascending', () => {
    const groups = groupByDate(todos, SortField.CreatedAt, SortOrder.Asc);
    expect(groups[0].items[0]._id).toBe('2');
  });
});

describe('groupByDate — DueDate sort', () => {
  it('treats missing dueDate as epoch (groups before items with a dueDate in asc)', () => {
    const withDue: Todo[] = [
      // 'a' has a future dueDate — will be grouped under Dec 31
      { ...t('a', 'Has due', '2026-06-04T00:00:00.000Z'), dueDate: '2026-12-31T00:00:00.000Z' },
      // 'b' has no dueDate — groups under its createdAt (June 4), smaller date = first in asc
      t('b', 'No due', '2026-06-04T00:00:00.000Z'),
    ];
    const groups = groupByDate(withDue, SortField.DueDate, SortOrder.Asc);
    // June 4 group ('b') should appear before Dec 31 group ('a') in ascending order
    expect(groups[0].items[0]._id).toBe('b');
  });
});

describe('groupByDate — edge cases', () => {
  it('returns an empty array for empty input', () => {
    expect(groupByDate([], SortField.CreatedAt, SortOrder.Desc)).toEqual([]);
  });

  it('handles a single todo', () => {
    const groups = groupByDate([todos[0]], SortField.CreatedAt, SortOrder.Desc);
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(1);
  });
});
