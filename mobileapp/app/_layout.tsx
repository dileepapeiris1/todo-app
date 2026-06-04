/** Root layout — providers, splash screen, and font loading. */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/contexts/AuthContext';
import { LoggerProvider } from '@/providers/LoggerProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';

// Keep splash visible until the app is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash once the layout is mounted and providers are ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <LoggerProvider>
      <QueryProvider>
        <AuthProvider>
          <SnackbarProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
          </SnackbarProvider>
        </AuthProvider>
      </QueryProvider>
    </LoggerProvider>
  );
}
