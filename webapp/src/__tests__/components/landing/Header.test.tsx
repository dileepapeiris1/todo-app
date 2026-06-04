import { beforeEach, describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Header from '@/components/common/header/Header';
import { renderWithProviders } from '@/__tests__/helpers';

const defaultProps = {
  brand:    'TrackLog',
  links:    [],
  loginCta: { label: 'Log in', href: '/signin' },
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('Header — content', () => {
  it('renders the brand name', () => {
    renderWithProviders(<Header {...defaultProps} />);
    expect(screen.getByText('TrackLog')).toBeInTheDocument();
  });

  it('renders the login CTA link', () => {
    renderWithProviders(<Header {...defaultProps} />);
    const links = screen.getAllByRole('link', { name: 'Log in' });
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders nav links when provided', () => {
    const props = { ...defaultProps, links: [{ label: 'Features', href: '#features' }] };
    renderWithProviders(<Header {...props} />);
    expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
  });
});

describe('Header — theme toggle', () => {
  it('renders a theme toggle button', () => {
    renderWithProviders(<Header {...defaultProps} />);
    const toggleBtns = screen.getAllByTitle(/switch to dark mode|dark mode/i);
    expect(toggleBtns.length).toBeGreaterThan(0);
  });

  it('toggles to dark mode when the toggle is clicked', () => {
    renderWithProviders(<Header {...defaultProps} />);
    fireEvent.click(screen.getAllByTitle(/switch to dark mode/i)[0]);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('Header — mobile menu', () => {
  it('shows the mobile menu when the hamburger button is clicked', () => {
    renderWithProviders(<Header {...defaultProps} links={[{ label: 'About', href: '/about' }]} />);
    const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuBtn);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  });
});
