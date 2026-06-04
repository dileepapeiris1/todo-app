/** Tests for ThemeProvider — enum values, toggle, and persistence. */

import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Theme, ThemeProvider, useTheme } from '@/providers/ThemeProvider';

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: false }),
  });
});

describe('ThemeProvider — initial theme', () => {
  it('defaults to Theme.Light when no preference stored and system is light', () => {
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Light);
  });

  it('defaults to Theme.Dark when system prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Dark);
  });

  it('reads Theme.Dark from localStorage', () => {
    localStorage.setItem('tracklog_theme', Theme.Dark);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Dark);
  });

  it('reads Theme.Light from localStorage', () => {
    localStorage.setItem('tracklog_theme', Theme.Light);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Light);
  });

  it('ignores an unrecognised value in localStorage', () => {
    localStorage.setItem('tracklog_theme', 'banana');
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Light);
  });
});

describe('ThemeProvider — toggle', () => {
  it('switches from Light to Dark', () => {
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Dark);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('switches back from Dark to Light', () => {
    localStorage.setItem('tracklog_theme', Theme.Dark);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe(Theme.Light);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists the toggled theme to localStorage', () => {
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('tracklog_theme')).toBe(Theme.Dark);
  });
});

describe('ThemeProvider — error boundary', () => {
  it('throws when useTheme is called outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeDisplay />)).toThrow('useTheme must be used within ThemeProvider');
    spy.mockRestore();
  });
});
