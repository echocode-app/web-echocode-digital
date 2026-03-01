import Image from 'next/image';
import LoginButton from '@/components/admin/LoginButton';

type LoginCardProps = {
  forbidden?: boolean;
};

export default function LoginCard({ forbidden = false }: LoginCardProps) {
  return (
    <section className="rounded-secondary border border-white bg-[rgba(0,0,0,0.8)] 
    p-6 pb-2 md:p-8 md:pb-3 shadow-main backdrop-blur-[26px] transition-all duration-500 ease-in-out hover:border-accent">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="font-main text-title-xs uppercase tracking-[0.24em] text-gray60">Admin panel</p>
          <h1 className="font-title text-title-2xl text-white">Sign in</h1>
          <p className="font-main text-main-sm text-gray75">Use your Google account with admin access</p>
          {forbidden ? (
            <p className="mt-1 px-1 py-0.5 font-main text-main-xs font-bold text-accent">Access is restricted for this account</p>
          ) : null}
        </div>

        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-(--radius-secondary) border border-gray16 bg-black/30">
          <Image
            src="/admin-favicon/mason.png"
            alt="Admin panel visual"
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        </div>
      </div>

      <LoginButton />
    </section>
  );
}
