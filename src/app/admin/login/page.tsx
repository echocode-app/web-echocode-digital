import LoginCard from '@/components/admin/LoginCard';

export const runtime = 'nodejs';

type AdminLoginPageProps = {
  searchParams?: Promise<{
    forbidden?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const forbidden = params?.forbidden === '1';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-8">
      <div className="pointer-events-none absolute inset-0 
      bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.95)_100%)]" />
      <div className="relative z-10 w-full max-w-md">
        <LoginCard forbidden={forbidden} />
      </div>
    </main>
  );
}
