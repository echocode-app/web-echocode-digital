'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

const toRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value as Record<string, unknown>;
};

export default function LoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const authorizeAdmin = async (idToken: string): Promise<Response> => {
    console.info('[admin-login] calling /api/admin/me with bearer token');
    return fetch('/api/admin/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cache: 'no-store',
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      console.info('[admin-login] starting Google sign-in');
      const auth = getFirebaseClientAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const credentials = await signInWithPopup(auth, provider);
      console.info('[admin-login] popup sign-in success', {
        uid: credentials.user.uid,
        email: credentials.user.email,
      });

      const firstToken = await credentials.user.getIdToken(true);
      console.info('[admin-login] first id token issued', {
        tokenLength: firstToken.length,
      });
      let response = await authorizeAdmin(firstToken);
      let payload: unknown = null;
      try {
        payload = await response.clone().json();
      } catch {
        payload = null;
      }
      console.info('[admin-login] /api/admin/me first response', {
        status: response.status,
        body: payload,
      });

      // Firebase custom claims can lag right after bootstrap, so retry once with a forced refresh.
      if (response.status === 403) {
        const refreshedToken = await credentials.user.getIdToken(true);
        console.info('[admin-login] retrying /api/admin/me with refreshed token', {
          tokenLength: refreshedToken.length,
        });
        response = await authorizeAdmin(refreshedToken);
        try {
          payload = await response.clone().json();
        } catch {
          payload = null;
        }
        console.info('[admin-login] /api/admin/me retry response', {
          status: response.status,
          body: payload,
        });
      }

      if (response.ok) {
        router.replace('/admin');
        return;
      }

      if (response.status === 401) {
        await signOut(auth).catch(() => undefined);
        setFeedback('Session is invalid. Please sign in again.');
        return;
      }

      if (response.status === 403) {
        setFeedback('Access denied for this account.');
        return;
      }

      setFeedback('Login failed. Try again in a few seconds.');
    } catch (error) {
      const normalizedError = toRecord(error);
      const errorCode =
        typeof normalizedError.code === 'string'
          ? normalizedError.code
          : typeof normalizedError.customData === 'object' &&
              normalizedError.customData &&
              typeof (normalizedError.customData as Record<string, unknown>).code === 'string'
            ? ((normalizedError.customData as Record<string, unknown>).code as string)
            : 'unknown';
      const errorMessage =
        typeof normalizedError.message === 'string' ? normalizedError.message : 'unknown';
      const errorName = typeof normalizedError.name === 'string' ? normalizedError.name : 'unknown';
      const errorStack =
        typeof normalizedError.stack === 'string' ? normalizedError.stack : undefined;

      console.error('[admin-login] client login failed', {
        name: errorName,
        code: errorCode,
        message: errorMessage,
        stack: errorStack,
        raw: normalizedError,
      });
      setFeedback('Login failed. Try again in a few seconds.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="group relative block w-full cursor-pointer overflow-hidden 
        rounded-secondary border border-white bg-transparent 
        px-4 py-3 font-title text-title-base text-white 
        shadow-button transition-all duration-500 ease-in-out 
        hover:border-accent focus:border-accent focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed 
        disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 
          bg-main-gradient opacity-0 transition-opacity duration-500 ease-in-out 
          group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="relative z-10">
          {isLoading ? 'Checking access...' : 'Continue with Google'}
        </span>
      </button>

      <div className="min-h-6 px-1 py-0.5">
        <p
          className={`font-main text-main-xs transition-all duration-600 ease-in-out ${
            feedback
              ? 'opacity-100 translate-y-0 text-accent font-bold'
              : 'opacity-0 -translate-y-0.5 text-transparent'
          }`}
          aria-live="polite"
        >
          {feedback ?? ' '}
        </p>
      </div>
    </div>
  );
}
