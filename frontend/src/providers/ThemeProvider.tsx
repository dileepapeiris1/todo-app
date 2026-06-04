/** Theme provider — manages light / dark mode and persists the preference. */

import {
  createContext, useCallback, useContext, useEffect, useState, type ReactNode,
} from 'react';

import { THEME_KEY } from '@/constants/storage';

/** Colour theme options for the application. */
export enum Theme {
  Light = 'light',
  Dark  = 'dark',
}

interface ThemeContextType {
  theme:       Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Reads the stored theme from localStorage, falling back to the OS preference.
 *
 * @returns {Theme} The initial theme value.
 */
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === Theme.Light || stored === Theme.Dark) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
}

/**
 * Hook to read the active theme and trigger a toggle.
 *
 * @returns {ThemeContextType} Active theme and toggle function.
 */
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/**
 * Provides the active theme to the component tree and applies the
 * 'dark' class to <html> so Tailwind dark: variants take effect.
 *
 * @param {{ children: ReactNode }} props - Component props.
 * @returns {JSX.Element} The provider wrapping its children.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === Theme.Dark);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => current === Theme.Light ? Theme.Dark : Theme.Light);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
