'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import LayoutShell from '@/components/admin/LayoutShell';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

type AdminProfile = {
  uid: string;
  email: string | null;
  role: 'admin' | 'developer' | 'manager' | null;
};

type AdminSessionContextValue = {
  profile: AdminProfile | null;
};

const AdminSessionContext = createContext<AdminSessionContextValue>({
  profile: null,
});

export function useAdminSession() {
  return useContext(AdminSessionContext);
}

type GuardStatus = 'checking' | 'allowed';

async function verifyAdmin(user: User): Promise<Response> {
  const idToken = await user.getIdToken(true);

  return fetch('/api/admin/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: 'no-store',
  });
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="rounded-[var(--radius-base)] border border-gray16 bg-base-gray/90 px-5 py-4 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
        <p className="font-main text-main-sm text-gray75">Authorizing admin access...</p>
      </div>
    </div>
  );
}

export default function AdminClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [status, setStatus] = useState<GuardStatus>('checking');

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage || profile) return;

    let mounted = true;
    const auth = getFirebaseClientAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      const response = await verifyAdmin(user);

      if (!mounted) return;

      if (response.ok) {
        const payload = (await response.json()) as {
          success: boolean;
          data?: AdminProfile;
        };

        if (payload.success && payload.data) {
          setProfile(payload.data);
          setStatus('allowed');
          return;
        }
      }

      if (response.status === 401) {
        await signOut(auth).catch(() => undefined);
        router.replace('/admin/login');
        return;
      }

      if (response.status === 403) {
        router.replace('/admin/login?forbidden=1');
        return;
      }

      router.replace('/admin/login');
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isLoginPage, pathname, profile, router]);

  const value = useMemo(
    () => ({
      profile,
    }),
    [profile],
  );

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status !== 'allowed' || !profile) {
    return <LoadingScreen />;
  }

  return (
    <AdminSessionContext.Provider value={value}>
      <LayoutShell role={profile.role ?? 'unknown'} email={profile.email}>
        {children}
      </LayoutShell>
    </AdminSessionContext.Provider>
  );
}
