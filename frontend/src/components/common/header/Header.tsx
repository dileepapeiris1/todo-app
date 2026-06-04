/** Landing page header — sticky top bar with brand, nav links, auth CTAs, and theme toggle. */

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { Theme, useTheme } from '@/providers/ThemeProvider';

interface NavLink { label: string; href: string }
interface CtaLink  { label: string; href: string }

interface HeaderProps {
  brand:      string;
  links:      NavLink[];
  loginCta:   CtaLink;
  signupCta?: CtaLink;
}

/**
 * Renders the sticky landing page header with responsive mobile menu and theme toggle.
 *
 * @param {HeaderProps} props - Component props.
 * @returns {JSX.Element} The header element.
 */
const Header = ({ brand, links, loginCta, signupCta }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme }  = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-quaternary-100/60 bg-secondary/90 backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-900/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <a href="/" className="flex items-center font-bold text-quaternary-900 hover:opacity-90 dark:text-gray-100">
          <span className="text-lg tracking-tight">{brand}</span>
        </a>

        {links.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(link => (
              <a key={link.href} href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-quaternary-600 transition-colors hover:bg-quaternary-100 hover:text-quaternary-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100">
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop — CTAs + theme toggle */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggleTheme}
            title={theme === Theme.Light ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-quaternary-500 transition-colors hover:bg-quaternary-100 hover:text-quaternary-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            {theme === Theme.Dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a href={loginCta.href}
            className="rounded-lg px-4 py-2 text-sm font-medium text-quaternary-600 transition-colors hover:text-quaternary-900 dark:text-gray-300 dark:hover:text-gray-100">
            {loginCta.label}
          </a>
          {signupCta && (
            <a href={signupCta.href}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
              {signupCta.label}
            </a>
          )}
        </div>

        {/* Mobile — theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleTheme}
            title={theme === Theme.Light ? 'Dark mode' : 'Light mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-quaternary-500 hover:bg-quaternary-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {theme === Theme.Dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-quaternary-600 hover:bg-quaternary-100 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => setMenuOpen(open => !open)}>
            {menuOpen
              ? <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-quaternary-100 bg-secondary px-4 pb-6 pt-4 md:hidden dark:border-gray-700 dark:bg-gray-900">
          {links.length > 0 && (
            <nav className="mb-4 flex flex-col gap-1">
              {links.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-quaternary-700 hover:bg-quaternary-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  {link.label}
                </a>
              ))}
            </nav>
          )}
          <a href={loginCta.href}
            className="block w-full rounded-xl border border-quaternary-200 py-2.5 text-center text-sm font-semibold text-quaternary-700 dark:border-gray-600 dark:text-gray-200">
            {loginCta.label}
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
