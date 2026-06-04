import { createContext, useContext, type ReactNode } from 'react';

interface Logger {
  debug: (msg: string, ...args: unknown[]) => void;
  info:  (msg: string, ...args: unknown[]) => void;
  warn:  (msg: string, ...args: unknown[]) => void;
  error: (msg: string, ...args: unknown[]) => void;
}

const LoggerContext = createContext<Logger | null>(null);

const isProd = process.env.NODE_ENV === 'production';

const logger: Logger = {
  debug: (msg, ...args) => { if (!isProd) console.debug(`[DEBUG] ${msg}`, ...args); },
  info:  (msg, ...args) => console.info(`[INFO]  ${msg}`, ...args),
  warn:  (msg, ...args) => console.warn(`[WARN]  ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
};

export function useLogger(): Logger {
  const ctx = useContext(LoggerContext);
  if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
  return ctx;
}

export function LoggerProvider({ children }: { children: ReactNode }) {
  return <LoggerContext.Provider value={logger}>{children}</LoggerContext.Provider>;
}
