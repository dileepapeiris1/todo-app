import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SortField, SortOrder } from '@/types/sorting';
import SortControls from '@/components/dashboard/SortControls';

function wrap(
  sortBy = SortField.DueDate, sortOrder = SortOrder.Asc,
  onSortBy = vi.fn(), onSortOrder = vi.fn(),
) {
  render(
    <ThemeProvider>
      <SortControls sortBy={sortBy} sortOrder={sortOrder} onSortBy={onSortBy} onSortOrder={onSortOrder} />
    </ThemeProvider>
  );
  return { onSortBy, onSortOrder };
}

describe('SortControls', () => {
  it('renders the "Sort by:" label', () => {
    wrap();
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('renders a select element', () => {
    wrap();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('select has the correct initial value', () => {
    wrap(SortField.CreatedAt);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe(SortField.CreatedAt);
  });

  it('calls onSortBy with the chosen value when select changes', () => {
    const { onSortBy } = wrap(SortField.DueDate);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: SortField.Title } });
    expect(onSortBy).toHaveBeenCalledWith(SortField.Title);
  });

  it('calls onSortOrder when the direction button is clicked', () => {
    const { onSortOrder } = wrap();
    fireEvent.click(screen.getByRole('button'));
    expect(onSortOrder).toHaveBeenCalledOnce();
  });

  it('shows ascending indicator when sortOrder is Asc', () => {
    wrap(SortField.DueDate, SortOrder.Asc);
    expect(screen.getByTitle('Ascending')).toBeInTheDocument();
  });

  it('shows descending indicator when sortOrder is Desc', () => {
    wrap(SortField.DueDate, SortOrder.Desc);
    expect(screen.getByTitle('Descending')).toBeInTheDocument();
  });
});
