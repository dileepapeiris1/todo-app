import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Header from '@/components/common/header/Header';

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
    render(<ThemeProvider><Header {...defaultProps} /></ThemeProvider>);
    expect(screen.getByText('TrackLog')).toBeInTheDocument();
  });

  it('renders the login CTA link', () => {
    render(<ThemeProvider><Header {...defaultProps} /></ThemeProvider>);
    const links = screen.getAllByRole('link', { name: 'Log in' });
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders nav links when provided', () => {
    const props = { ...defaultProps, links: [{ label: 'Features', href: '#features' }] };
    render(<ThemeProvider><Header {...props} /></ThemeProvider>);
    expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
  });
});

describe('Header — theme toggle', () => {
  it('renders a theme toggle button', () => {
    render(<ThemeProvider><Header {...defaultProps} /></ThemeProvider>);
    const toggleBtns = screen.getAllByTitle(/switch to dark mode|dark mode/i);
    expect(toggleBtns.length).toBeGreaterThan(0);
  });

  it('toggles to dark mode when the toggle is clicked', () => {
    render(<ThemeProvider><Header {...defaultProps} /></ThemeProvider>);
    fireEvent.click(screen.getAllByTitle(/switch to dark mode/i)[0]);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('Header — mobile menu', () => {
  it('shows the mobile menu when the hamburger button is clicked', () => {
    render(<ThemeProvider><Header {...defaultProps} links={[{ label: 'About', href: '/about' }]} /></ThemeProvider>);
    const menuBtn = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuBtn);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  });
});
