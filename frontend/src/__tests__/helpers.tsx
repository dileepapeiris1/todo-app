/** Shared test utilities — providers wrapper and fixture factories. */

import { type ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@/providers/ThemeProvider';

/**
 * Wraps a component with the minimum required providers for unit tests.
 * Auth is excluded — mock useAuth individually where needed.
 *
 * @param {ReactElement} ui - The component tree to render.
 * @returns {RenderResult} Testing Library render result.
 */
export function renderWithProviders(ui: ReactElement): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries:   { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{ui}</ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

/** Builds a minimal Todo fixture with sensible defaults. */
export function makeTodo(overrides: Record<string, unknown> = {}) {
  return {
    _id:         'test-id-1',
    title:       'Test task',
    description: '',
    done:        false,
    createdAt:   '2026-06-04T10:00:00.000Z',
    ...overrides,
  };
}
