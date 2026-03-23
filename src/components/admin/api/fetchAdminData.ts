import { getFirebaseClientAuth } from '@/lib/firebase/client';

type ApiPayload<T> = {
  success: boolean;
  data?: T;
};

async function getAuthToken(): Promise<string> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user.getIdToken(true);
}

// Shared authenticated fetch helper for admin client hooks.
export async function fetchAdminData<T>(
  input: {
    url: string;
    signal: AbortSignal;
    requestErrorMessage: string;
    payloadErrorMessage: string;
  },
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(input.url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal: input.signal,
  });

  if (!response.ok) {
    throw new Error(input.requestErrorMessage);
  }

  const payload = (await response.json()) as ApiPayload<T>;

  if (!payload.success || !payload.data) {
    throw new Error(input.payloadErrorMessage);
  }

  return payload.data;
}
