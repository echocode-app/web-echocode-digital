'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export const navLinkBaseClass =
  'relative font-main uppercase ' +
  'bg-main-gradient bg-clip-text bg-transparent ' +
  'transition-all duration-main ' +
  'group-hover:text-transparent group-hover:bg-clip-text group-hover:after:opacity-100 ' +
  'hover:text-transparent hover:bg-clip-text ' +
  'after:absolute after:left-0 after:-bottom-[-2px] after:h-px after:w-full ' +
  'after:bg-main-gradient after:opacity-0 after:transition-opacity ' +
  'after:duration-main hover:after:opacity-100 ' +
  'after:[animation:section-gradient-drift_5s_ease-in-out_infinite]  after:bg-size-[200%_200%] [animation:section-gradient-drift_5s_ease-in-out_infinite]  bg-size-[200%_200%] after:content-[""]  ';

const navLinkActiveClass = 'text-transparent bg-main-gradient bg-clip-text after:opacity-100';

interface NavLinkProps {
  children: ReactNode;
  link: string;
}

const NavLink = ({ children, link }: NavLinkProps) => {
  const locale = useLocale();
  const textSize = locale === 'ua' ? 'text-main-sm font-semibold' : 'text-main-base-link';

  const pathname = usePathname();
  const isActive = pathname === link || pathname.startsWith(link + '/');

  return (
    <Link
      href={link}
      data-text={children}
      className={`${navLinkBaseClass} ${isActive ? navLinkActiveClass : ''}  ${textSize}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
