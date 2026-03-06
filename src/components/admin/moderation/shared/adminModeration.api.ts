import { getFirebaseClientAuth } from '@/lib/firebase/client';

export function withAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminIdTokenOrThrow(): Promise<string> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user.getIdToken(true);
}

export async function parseAdminApiError(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    const message = payload.error?.message?.trim();

    if (message) {
      return message;
    }
  } catch {
    // Ignore malformed payloads and fall back to the provided message.
  }

  return fallback;
}
