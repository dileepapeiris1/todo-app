/** Authentication context — stores token and user using SecureStore. */

import {
  createContext, useCallback, useContext, useEffect, useState, type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY, USER_KEY } from '@/constants/storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user:    AuthUser | null;
  token:   string | null;
  loading: boolean;
  signIn:  (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token,   setToken]   = useState<string | null>(null);
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser  = await SecureStore.getItemAsync(USER_KEY);
      if (storedToken) setToken(storedToken);
      if (storedUser)  setUser(JSON.parse(storedUser) as AuthUser);
      setLoading(false);
    }
    void restore();
  }, []);

  const signIn = useCallback(async (newToken: string, newUser: AuthUser) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
