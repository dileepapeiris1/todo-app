import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from '@/components/common/footer/Footer';
import { renderWithProviders } from '@/__tests__/helpers';

describe('Footer', () => {
  it('renders the brand name as a link', () => {
    renderWithProviders(<Footer brand="TrackLog" tagline="Track your tasks." />);
    expect(screen.getByRole('link', { name: 'TrackLog' })).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderWithProviders(<Footer brand="TrackLog" tagline="Track your tasks." />);
    expect(screen.getByText('Track your tasks.')).toBeInTheDocument();
  });

  it('renders the current copyright year', () => {
    renderWithProviders(<Footer brand="TrackLog" tagline="Tagline" />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('brand link points to /home', () => {
    renderWithProviders(<Footer brand="TrackLog" tagline="Tagline" />);
    const link = screen.getByRole('link', { name: 'TrackLog' });
    expect(link.getAttribute('href')).toBe('/home');
  });
});
