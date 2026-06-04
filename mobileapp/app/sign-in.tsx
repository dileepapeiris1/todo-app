import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL, APP_NAME } from '@/constants/config';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { signIn } = useAuth();
  const router     = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: 'https://auth.expo.io/@dileepapeiris/tracklog',
    responseType: 'id_token',
    shouldAutoExchangeCode: false,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type !== 'success') {
      if (response.type === 'error') {
        console.error('Google Auth Error response:', response.error);
        setError('Authentication error: ' + (response.error?.message ?? 'Unknown error'));
      }
      return;
    }

    const idToken = response.params.id_token;
    console.log('Google Auth ID Token retrieved directly:', !!idToken);
    if (!idToken) {
      setError('Could not get ID token from Google.');
      return;
    }

    async function exchangeToken() {
      setLoading(true);
      setError('');
      try {
        console.log('Exchanging ID token with backend API...');
        const res = await fetch(`${API_URL}/api/v1/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: idToken }),
        });
        console.log('Backend response status:', res.status);
        const data = await res.json() as {
          token?: string;
          user?: { id: string; email: string; name: string };
          message?: string;
        };
        console.log('Backend response data:', data);
        if (!res.ok) {
          setError(data.message ?? 'Sign in failed. Please try again.');
          return;
        }
        if (data.token && data.user) {
          console.log('Sign in successful, navigating to /todo');
          await signIn(data.token, data.user);
          router.replace('/todo');
        }
      } catch (err) {
        console.error('Backend exchange error:', err);
        setError('Network error. Is the server running?');
      } finally {
        setLoading(false);
      }
    }

    void exchangeToken();
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>{APP_NAME}</Text>
        <Text style={styles.tagline}>Track your tasks. Log your progress.</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#e44332" style={styles.spinner} />
        ) : (
          <TouchableOpacity
            style={[styles.googleBtn, !request && styles.googleBtnDisabled]}
            onPress={() => {
              if (request?.url) {
                const nativeRedirectUri = AuthSession.makeRedirectUri({
                  path: 'expo-auth-session',
                });
                
                // Store the original redirectUri (the proxy URL)
                const originalRedirectUri = request.redirectUri;
                // Mutate the request redirectUri to nativeRedirectUri so promptAsync uses it as the returnUrl
                // @ts-ignore
                request.redirectUri = nativeRedirectUri;

                const proxyStartUrl = `https://auth.expo.io/@dileepapeiris/tracklog/start?${new URLSearchParams({
                  authUrl: request.url,
                  returnUrl: nativeRedirectUri,
                }).toString()}`;
                
                promptAsync({ url: proxyStartUrl })
                  .then(res => {
                    console.log('promptAsync completed with result:', res);
                    // Restore original redirectUri so token exchange uses the proxy URL
                    // @ts-ignore
                    request.redirectUri = originalRedirectUri;
                  })
                  .catch(err => {
                    console.error('promptAsync failed with error:', err);
                    // Restore on error as well
                    // @ts-ignore
                    request.redirectUri = originalRedirectUri;
                  });
              } else {
                console.warn('Google Auth Request is not ready yet.');
              }
            }}
            disabled={!request}
          >
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafaf9',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  spinner: {
    marginVertical: 20,
  },
  googleBtn: {
    width: '100%',
    backgroundColor: '#e44332',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  googleBtnDisabled: {
    opacity: 0.5,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
