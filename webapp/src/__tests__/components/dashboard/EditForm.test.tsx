import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { makeTodo } from '@/__tests__/helpers';
import EditForm from '@/components/dashboard/EditForm';

function wrap(overrides = {}, onSave = vi.fn(), onCancel = vi.fn()) {
  const todo = makeTodo({ title: 'Original title', description: 'Original desc', ...overrides });
  render(
    <ThemeProvider>
      <EditForm todo={todo} onSave={onSave} onCancel={onCancel} />
    </ThemeProvider>
  );
  return { todo, onSave, onCancel };
}

describe('EditForm — rendering', () => {
  it('pre-fills the title input with the existing todo title', () => {
    wrap();
    const input = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    expect(input.value).toBe('Original title');
  });

  it('pre-fills the description input', () => {
    wrap();
    const input = screen.getAllByRole('textbox')[1] as HTMLInputElement;
    expect(input.value).toBe('Original desc');
  });

  it('renders Save changes and Cancel buttons', () => {
    wrap();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});

describe('EditForm — interactions', () => {
  it('calls onCancel when Cancel is clicked', () => {
    const { onCancel } = wrap();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onSave with the todo id and updated title', () => {
    const { onSave, todo } = wrap();
    const titleInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(titleInput, { target: { value: 'Updated title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSave).toHaveBeenCalledWith(todo._id, expect.objectContaining({ title: 'Updated title' }));
  });

  it('does not call onSave when title is empty', () => {
    const { onSave } = wrap();
    const titleInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSave).not.toHaveBeenCalled();
  });
});
