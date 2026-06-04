import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GOOGLE_GSI_SCRIPT_URL,
  SIGN_IN_ERROR_FAILED,
  SIGN_IN_ERROR_NETWORK,
  SIGN_IN_HEADING,
  SIGN_IN_HINT,
  SIGN_IN_LOADING_TEXT,
  SIGN_IN_SUBHEADING,
} from '@/constants/auth';
import { API_URL } from '@/constants/config';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (r: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, config: object) => void;
        };
      };
    };
  }
}

const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn, token } = useAuth();
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false); 
  const [buttonReady, setButtonReady] = useState(false);

  // Redirect immediately if the user is already authenticated
  useEffect(() => {
    if (token) navigate(ROUTES.APP, { replace: true });
  }, [token, navigate]);

  // Load the Google Identity Services SDK and render the sign-in button
  useEffect(() => {
    const handleCredential = async (r: { credential: string }) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: r.credential }),
        });
        const data = await res.json() as {
          token?: string;
          user?: { id: string; email: string; name: string };
          message?: string;
        };
        if (!res.ok) {
          setError(data.message ?? SIGN_IN_ERROR_FAILED);
          return;
        }
        if (data.token && data.user) {
          signIn(data.token, data.user);
          navigate(ROUTES.APP, { replace: true });
        }
      } catch {
        setError(SIGN_IN_ERROR_NETWORK);
      } finally {
        setLoading(false);
      }
    };

    const initGoogle = () => {
      window.google?.accounts.id.initialize({
        client_id: window.APP_CONFIG?.GOOGLE_CLIENT_ID ?? '',
        callback:  handleCredential,
      });
      const el = document.getElementById('google-btn');
      if (el) {
        window.google?.accounts.id.renderButton(el, {
          theme:          'outline',
          size:           'large',
          text:           'signin_with',
          shape:          'rectangular',
          logo_alignment: 'left',
          width:          280,
        });
        setButtonReady(true);
      }
    };

    if (window.google) {
      initGoogle();
      return;
    }

    const script    = document.createElement('script');
    script.src      = GOOGLE_GSI_SCRIPT_URL;
    script.async    = true;
    script.onload   = initGoogle;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [navigate, signIn]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf9] px-4 dark:bg-gray-900">

      {/* Brand name — links back to the landing page */}
      <a
        href={ROUTES.HOME}
        className="mb-8 text-2xl font-black tracking-tight text-quaternary-900 transition-opacity hover:opacity-70 dark:text-gray-100"
      >
        TrackLog
      </a>

      {/* Sign-in card */}
      <div className="w-full max-w-[360px] rounded-2xl bg-white px-8 py-10 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.08)] dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700">

        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="text-xl font-bold text-quaternary-900 dark:text-gray-100">{SIGN_IN_HEADING}</h1>
          <p className="mt-1 text-sm text-quaternary-400 dark:text-gray-400">{SIGN_IN_SUBHEADING}</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Google button area */}
        <div className="flex flex-col items-center gap-5">
          {loading ? (
            /* Signing-in spinner shown after credential is received */
            <div className="flex h-11 items-center gap-2 text-sm text-quaternary-400 dark:text-gray-400">
              <svg className="h-4 w-4 animate-spin text-quaternary-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {SIGN_IN_LOADING_TEXT}
            </div>
          ) : (
            <div className="relative flex min-h-[44px] w-[280px] items-center justify-center">
              {/* Skeleton — visible while the Google SDK script is still loading */}
              {!buttonReady && (
                <div className="absolute inset-0 flex items-center">
                  <div className="h-[44px] w-full animate-pulse rounded-md bg-quaternary-100 dark:bg-gray-700" />
                </div>
              )}
              {/* Google renders its button into this div */}
              <div
                id="google-btn"
                className={`transition-opacity duration-300 ${buttonReady ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          )}

          <p className="text-xs text-quaternary-300 dark:text-gray-500">
            {SIGN_IN_HINT}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
