/** Tests for LoggerProvider — console delegation and useLogger hook. */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoggerProvider, useLogger } from '@/providers/LoggerProvider';

function LogDisplay() {
  const logger = useLogger();
  return (
    <>
      <button onClick={() => logger.info('hello info')}>Info</button>
      <button onClick={() => logger.warn('hello warn')}>Warn</button>
      <button onClick={() => logger.error('hello error')}>Error</button>
      <button onClick={() => logger.debug('hello debug')}>Debug</button>
    </>
  );
}

describe('LoggerProvider', () => {
  it('renders its children', () => {
    render(<LoggerProvider><p>child</p></LoggerProvider>);
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('provides a logger that calls console.info', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    render(<LoggerProvider><LogDisplay /></LoggerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Info' }));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('hello info'));
    spy.mockRestore();
  });

  it('provides a logger that calls console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LoggerProvider><LogDisplay /></LoggerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Warn' }));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('hello warn'));
    spy.mockRestore();
  });

  it('provides a logger that calls console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<LoggerProvider><LogDisplay /></LoggerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('hello error'));
    spy.mockRestore();
  });

  it('throws when useLogger is called outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<LogDisplay />)).toThrow('useLogger must be used within LoggerProvider');
    spy.mockRestore();
  });
});
