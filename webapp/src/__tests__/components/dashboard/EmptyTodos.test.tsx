import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyTodos from '@/components/dashboard/EmptyTodos';

describe('EmptyTodos', () => {
  it('renders the provided label', () => {
    render(<EmptyTodos label="No tasks yet" />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('renders a "Click Add task" hint', () => {
    render(<EmptyTodos label="Empty" />);
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });

  it('does not render Add task button if onAddTask is not provided', () => {
    render(<EmptyTodos label="Empty" />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('renders Add task button and calls onAddTask when clicked', () => {
    const onAddTask = vi.fn();
    render(<EmptyTodos label="Empty" onAddTask={onAddTask} />);
    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAddTask).toHaveBeenCalledTimes(1);
  });
});
