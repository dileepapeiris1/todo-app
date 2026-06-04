import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Hero from '@/components/landing/Hero';

const props = {
  headline:    'Organize your work.\nGet things done.',
  subheadline: 'A fast, simple task manager.',
  primaryCta:  { label: "Let's Start", href: '/signin' },
};

describe('Hero', () => {
  it('renders the headline text', () => {
    render(<ThemeProvider><Hero {...props} /></ThemeProvider>);
    expect(screen.getByText(/Organize your work/i)).toBeInTheDocument();
  });

  it('renders the subheadline', () => {
    render(<ThemeProvider><Hero {...props} /></ThemeProvider>);
    expect(screen.getByText(/A fast, simple task manager/i)).toBeInTheDocument();
  });

  it('renders a CTA link with the correct href', () => {
    render(<ThemeProvider><Hero {...props} /></ThemeProvider>);
    const links = screen.getAllByRole('link');
    const cta   = links.find(l => l.getAttribute('href') === '/signin');
    expect(cta).toBeTruthy();
    expect(cta?.textContent).toContain("Let's Start");
  });

  it('renders the dashboard screenshot image', () => {
    render(<ThemeProvider><Hero {...props} /></ThemeProvider>);
    const imgs = screen.getAllByRole('img');
    expect(imgs.some(img => img.getAttribute('alt')?.includes('dashboard'))).toBe(true);
  });
});
