/** Global snackbar provider — surfaces success and error toast notifications via Alert. */

import {
  createContext, useCallback, useContext, useState, type ReactNode,
} from 'react';
import { Alert } from 'react-native';
import { SnackType, type Snack } from '@/types/snack';

interface SnackbarContextType {
  showSnack: (message: string, type: SnackType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function useSnackbar(): SnackbarContextType {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const showSnack = useCallback((message: string, type: SnackType) => {
    if (type === SnackType.Error) {
      Alert.alert('Error', message);
    }
    // Success messages are silent on mobile — the UI updates immediately
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnack }}>
      {children}
    </SnackbarContext.Provider>
  );
}
