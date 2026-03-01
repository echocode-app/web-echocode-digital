import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

function assertFirebaseClientConfig(): void {
  const missing = [
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'NEXT_PUBLIC_FIREBASE_API_KEY' : null,
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' : null,
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' : null,
    !process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'NEXT_PUBLIC_FIREBASE_APP_ID' : null,
  ].filter((key): key is string => key !== null);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase client config keys: ${missing.join(', ')}`);
  }
}

function getFirebaseClientApp(): FirebaseApp {
  assertFirebaseClientConfig();

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  });
}

export function getFirebaseClientAuth(): Auth {
  return getAuth(getFirebaseClientApp());
}
