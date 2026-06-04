import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { TOKEN_KEY, USER_KEY } from '@/constants/storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user:    AuthUser | null;
  token:   string | null;
  signIn:  (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides authentication state to the component tree.
 * Persists the token and user to localStorage so sessions survive page refreshes.
 *
 * @param {{ children: ReactNode }} props - Component props.
 * @returns {JSX.Element} The provider element.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]   = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const signIn = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth state and actions from any component inside AuthProvider.
 *
 * @returns {AuthContextType} Auth context value with user, token, signIn, and signOut.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
