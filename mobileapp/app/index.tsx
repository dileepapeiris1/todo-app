/** Entry point — redirects to sign-in or todo based on auth state. */

import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { token, loading } = useAuth();
  const router             = useRouter();

  useEffect(() => {
    if (loading) return;
    if (token) {
      router.replace('/todo');
    } else {
      router.replace('/sign-in');
    }
  }, [token, loading]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#e44332" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
