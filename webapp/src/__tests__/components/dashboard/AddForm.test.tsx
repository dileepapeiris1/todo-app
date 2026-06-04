import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import AddForm from '@/components/dashboard/AddForm';

function wrap(onAdd = vi.fn(), onCancel = vi.fn(), busy = false) {
  render(
    <ThemeProvider>
      <AddForm onAdd={onAdd} onCancel={onCancel} busy={busy} />
    </ThemeProvider>
  );
  return { onAdd, onCancel };
}

describe('AddForm — rendering', () => {
  it('renders a task name placeholder', () => {
    wrap();
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
  });

  it('renders a description placeholder', () => {
    wrap();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('renders Cancel and Add task buttons', () => {
    wrap();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add task' })).toBeInTheDocument();
  });

  it('disables Add task button when title is empty', () => {
    wrap();
    expect(screen.getByRole('button', { name: 'Add task' })).toBeDisabled();
  });

  it('enables Add task button when title has text', () => {
    wrap();
    fireEvent.change(screen.getByPlaceholderText('Task name'), { target: { value: 'hello' } });
    expect(screen.getByRole('button', { name: 'Add task' })).not.toBeDisabled();
  });
});

describe('AddForm — interactions', () => {
  it('calls onCancel when Cancel button is clicked', () => {
    const { onCancel } = wrap();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onAdd with trimmed title when Add task is clicked', () => {
    const { onAdd } = wrap();
    fireEvent.change(screen.getByPlaceholderText('Task name'), { target: { value: '  Buy milk  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Buy milk' })
    );
  });

  it('calls onCancel when an empty title is submitted', () => {
    const { onCancel, onAdd } = wrap();
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    expect(onAdd).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled(); // button is disabled
  });

  it('disables inputs when busy is true', () => {
    wrap(vi.fn(), vi.fn(), true);
    expect(screen.getByPlaceholderText('Task name')).toBeDisabled();
  });
});
