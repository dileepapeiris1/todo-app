import { createContext, useContext, type ReactNode } from 'react';

interface Logger {
  debug: (msg: string, ...args: unknown[]) => void;
  info:  (msg: string, ...args: unknown[]) => void;
  warn:  (msg: string, ...args: unknown[]) => void;
  error: (msg: string, ...args: unknown[]) => void;
}

const LoggerContext = createContext<Logger | null>(null);

const isProd = import.meta.env.PROD;

const logger: Logger = {
  debug: (msg, ...args) => { if (!isProd) console.debug(`[DEBUG] ${msg}`, ...args); },
  info:  (msg, ...args) => console.info(`[INFO]  ${msg}`, ...args),
  warn:  (msg, ...args) => console.warn(`[WARN]  ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
};

/**
 * Hook to access the application logger from any component inside LoggerProvider.
 *
 * @returns {Logger} Logger instance with debug, info, warn, and error methods.
 */
export function useLogger(): Logger {
  const ctx = useContext(LoggerContext);
  if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
  return ctx;
}

/**
 * Provides a shared logger instance to the component tree.
 *
 * @param {{ children: ReactNode }} props - Component props.
 * @returns {JSX.Element} The provider wrapping its children.
 */
export function LoggerProvider({ children }: { children: ReactNode }) {
  return (
    <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>
  );
}
