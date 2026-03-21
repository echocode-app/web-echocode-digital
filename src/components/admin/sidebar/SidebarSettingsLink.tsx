'use client';

import Link from 'next/link';

type SidebarSettingsLinkProps = {
  pathname: string;
  onClick?: () => void;
};

export default function SidebarSettingsLink({ pathname, onClick }: SidebarSettingsLinkProps) {
  return (
    <Link
      href="/admin/settings"
      onClick={onClick}
      className={`
        group
        inline-flex h-9 w-9 items-center justify-center
        rounded-(--radius-secondary)
        border border-gray16
        text-gray75
        transition duration-main
        hover:border-accent hover:text-white
        ${pathname === '/admin/settings' ? 'border-accent text-white' : ''}
      `}
      aria-label="Open admin settings"
      title="Open admin settings"
    >
      <span
        aria-hidden="true"
        className="
          h-4.5 w-4.5
          bg-current
          opacity-80
          transition duration-main
          group-hover:opacity-100
        "
        style={{
          maskImage: 'url(/UI/settings.svg)',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskImage: 'url(/UI/settings.svg)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          WebkitMaskSize: 'contain',
        }}
      />
    </Link>
  );
}
