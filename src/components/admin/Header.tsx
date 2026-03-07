type HeaderProps = {
  email: string | null;
  role: string;
  onOpenMobileSidebar: () => void;
};

export default function Header({ email, role, onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="border-b border-gray16 px-4 py-4 md:px-6">
      <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open admin navigation"
            title="Open navigation"
            className="inline-flex h-9 w-9 items-center justify-center 
          rounded-(--radius-secondary) border border-gray16 
          text-gray75 
          transition duration-main 
          hover:text-white md:hidden"
          >
            <span className="relative block h-3.5 w-4.5" aria-hidden="true">
              <span className="absolute left-0 top-0 h-px w-full bg-current" />
              <span className="absolute left-0 top-1.5 h-px w-full bg-current" />
              <span className="absolute left-0 top-3 h-px w-full bg-current" />
            </span>
          </button>

          <div>
            <h1 className="font-main text-title-xs uppercase tracking-[0.18em] text-gray60">
              Control panel
            </h1>
            <h2 className="font-title text-title-base text-white">Admin</h2>
          </div>
        </div>

        <p className="hidden text-center font-main text-main-xs text-gray60 md:block">
          Timezone: Europe/Kiev
        </p>

        <div className="text-right">
          <p className="hidden font-main text-main-sm text-gray75 sm:block">
            {email ?? 'No email'}
          </p>
          <p className="font-main text-title-xs uppercase text-accent-hover">{role}</p>
        </div>
      </div>
    </header>
  );
}
