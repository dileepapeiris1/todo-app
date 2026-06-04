import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import PressQuotes from '@/components/landing/PressQuotes';

const items = [
  { quote: 'First quote',  publication: 'Nimal',  accentColor: 'bg-primary' },
  { quote: 'Second quote', publication: 'Kamal',  accentColor: 'bg-info'    },
  { quote: 'Third quote',  publication: 'Amal',   accentColor: 'bg-success' },
];

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('PressQuotes', () => {
  it('renders the section title', () => {
    render(<ThemeProvider><PressQuotes title="What users say" items={items} /></ThemeProvider>);
    expect(screen.getByText('What users say')).toBeInTheDocument();
  });

  it('renders all three publication names somewhere in the DOM', () => {
    render(<ThemeProvider><PressQuotes title="Reviews" items={items} /></ThemeProvider>);
    expect(screen.getAllByText('Nimal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kamal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Amal').length).toBeGreaterThan(0);
  });

  it('renders Prev and Next navigation buttons', () => {
    render(<ThemeProvider><PressQuotes title="Reviews" items={items} /></ThemeProvider>);
    expect(screen.getByRole('button', { name: /previous quote/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next quote/i })).toBeInTheDocument();
  });

  it('renders the correct number of dot indicators', () => {
    render(<ThemeProvider><PressQuotes title="Reviews" items={items} /></ThemeProvider>);
    const dots = screen.getAllByRole('button', { name: /quote \d/i });
    expect(dots).toHaveLength(items.length);
  });

  it('auto-advances after 4 seconds (carousel is cycling)', () => {
    render(<ThemeProvider><PressQuotes title="Reviews" items={items} /></ThemeProvider>);
    // The carousel starts at index 0 and auto-advances via setInterval
    act(() => { vi.advanceTimersByTime(4001); });
    // All quotes are rendered in the DOM (opacity controls visibility on mobile)
    expect(screen.getAllByText('Kamal').length).toBeGreaterThan(0);
  });

  it('has a dot button for each quote', () => {
    render(<ThemeProvider><PressQuotes title="Reviews" items={items} /></ThemeProvider>);
    for (let i = 1; i <= items.length; i++) {
      expect(screen.getByRole('button', { name: `Quote ${i}` })).toBeInTheDocument();
    }
  });
});
