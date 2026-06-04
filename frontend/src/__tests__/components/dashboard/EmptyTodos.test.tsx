import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
