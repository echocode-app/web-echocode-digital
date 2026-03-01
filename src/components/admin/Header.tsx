type HeaderProps = {
  email: string | null;
  role: string;
};

export default function Header({ email, role }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray16 px-4 py-4 md:px-6">
      <div>
        <h1 className="font-main text-title-xs uppercase tracking-[0.18em] text-gray60">Control panel</h1>
        <h2 className="font-title text-title-base text-white">Admin</h2>
      </div>
      <div className="text-right">
        <p className="font-main text-main-sm text-gray75">{email ?? 'No email'}</p>
        <p className="font-main text-title-xs uppercase text-accent-hover">{role}</p>
      </div>
    </header>
  );
}
