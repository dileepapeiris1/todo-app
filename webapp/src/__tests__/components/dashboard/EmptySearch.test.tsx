import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptySearch from '@/components/dashboard/EmptySearch';

describe('EmptySearch', () => {
  it('displays the search query in the message', () => {
    render(<EmptySearch query="meeting notes" />);
    expect(screen.getByText(/meeting notes/i)).toBeInTheDocument();
  });

  it('shows a spelling/spelling hint', () => {
    render(<EmptySearch query="x" />);
    expect(screen.getByText(/spelling/i)).toBeInTheDocument();
  });
});
