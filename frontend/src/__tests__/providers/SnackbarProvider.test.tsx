/** Tests for SnackbarProvider — display, dismiss, and auto-close. */

import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { SnackbarProvider, useSnackbar } from '@/providers/SnackbarProvider';
import { SnackType } from '@/types/snack';

function SnackTrigger({ msg, type }: { msg: string; type: SnackType }) {
  const { showSnack } = useSnackbar();
  return <button onClick={() => showSnack(msg, type)}>Show</button>;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('SnackbarProvider', () => {
  it('renders its children', () => {
    render(<SnackbarProvider><p>child</p></SnackbarProvider>);
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('shows a success snack when showSnack is called', () => {
    render(<SnackbarProvider><SnackTrigger msg="Saved!" type={SnackType.Success} /></SnackbarProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('shows an error snack when showSnack is called with Error type', () => {
    render(<SnackbarProvider><SnackTrigger msg="Failed" type={SnackType.Error} /></SnackbarProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('auto-dismisses after 4 seconds', () => {
    render(<SnackbarProvider><SnackTrigger msg="Bye!" type={SnackType.Success} /></SnackbarProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Bye!')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4001));
    expect(screen.queryByText('Bye!')).not.toBeInTheDocument();
  });

  it('can be dismissed manually via the × button', () => {
    render(<SnackbarProvider><SnackTrigger msg="Dismiss me" type={SnackType.Success} /></SnackbarProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('throws when useSnackbar is called outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SnackTrigger msg="x" type={SnackType.Success} />)).toThrow();
    spy.mockRestore();
  });
});
