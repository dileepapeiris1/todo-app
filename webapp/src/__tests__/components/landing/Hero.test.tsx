import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Hero from '@/components/landing/Hero';
import { renderWithProviders } from '../../helpers';

const props = {
  headline:    'Organize your work.\nGet things done.',
  subheadline: 'A fast, simple task manager.',
  primaryCta:  { label: "Let's Start", href: '/signin' },
};

describe('Hero', () => {
  it('renders the headline text', () => {
    renderWithProviders(<Hero {...props} />);
    expect(screen.getByText(/Organize your work/i)).toBeInTheDocument();
  });

  it('renders the subheadline', () => {
    renderWithProviders(<Hero {...props} />);
    expect(screen.getByText(/A fast, simple task manager/i)).toBeInTheDocument();
  });

  it('renders a CTA link with the correct href', () => {
    renderWithProviders(<Hero {...props} />);
    const links = screen.getAllByRole('link');
    const cta   = links.find(l => l.getAttribute('href') === '/signin');
    expect(cta).toBeTruthy();
    expect(cta?.textContent).toContain("Let's Start");
  });

  it('renders the dashboard screenshot image', () => {
    renderWithProviders(<Hero {...props} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs.some(img => img.getAttribute('alt')?.includes('dashboard'))).toBe(true);
  });
});
