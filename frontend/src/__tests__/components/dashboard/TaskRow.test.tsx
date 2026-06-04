import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { makeTodo } from '@/__tests__/helpers';
import TaskRow from '@/components/dashboard/TaskRow';

function wrap(overrides = {}) {
  const todo     = makeTodo(overrides);
  const onToggle = vi.fn();
  const onEdit   = vi.fn();
  const onDelete = vi.fn();
  render(
    <ThemeProvider>
      <TaskRow todo={todo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
    </ThemeProvider>
  );
  return { todo, onToggle, onEdit, onDelete };
}

describe('TaskRow — rendering', () => {
  it('displays the todo title', () => {
    wrap({ title: 'Buy milk' });
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('displays the description when present', () => {
    wrap({ description: 'Skimmed, 2 litres' });
    expect(screen.getByText('Skimmed, 2 litres')).toBeInTheDocument();
  });

  it('does not render a description paragraph when description is empty', () => {
    wrap({ description: '' });
    expect(document.querySelector('.line-clamp-2')).toBeNull();
  });

  it('applies line-through style when done', () => {
    wrap({ done: true, title: 'Finished' });
    const p = screen.getByText('Finished');
    expect(p.style.textDecoration).toBe('line-through');
  });

  it('does not apply line-through when pending', () => {
    wrap({ done: false, title: 'Pending' });
    const p = screen.getByText('Pending');
    expect(p.style.textDecoration).not.toBe('line-through');
  });

  it('shows a time badge when dueDate is set', () => {
    wrap({ dueDate: '2026-06-10T14:30:00.000Z' });
    expect(document.querySelector('.text-primary')).toBeTruthy();
  });
});

describe('TaskRow — aria labels', () => {
  it('has "Mark complete" label when todo is pending', () => {
    wrap({ done: false });
    expect(screen.getByRole('button', { name: /mark complete/i })).toBeInTheDocument();
  });

  it('has "Mark incomplete" label when todo is done', () => {
    wrap({ done: true });
    expect(screen.getByRole('button', { name: /mark incomplete/i })).toBeInTheDocument();
  });

  it('has "Edit" and "Delete" aria labels', () => {
    wrap();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});

describe('TaskRow — interactions', () => {
  it('calls onToggle when the checkbox button is clicked', () => {
    const { onToggle } = wrap({ done: false });
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('calls onEdit when the edit button is clicked', () => {
    const { onEdit } = wrap();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it('calls onDelete when the delete button is clicked', () => {
    const { onDelete } = wrap();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
