'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DropdownLinkProps {
  children: ReactNode;
  link: string;
}

const DropdownLink = ({ children, link }: DropdownLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={`
        ${isActive ? 'before:opacity-100' : ''} 
    relative block w-full px-1 py-2 md:text-main-sm lg:text-main-base 
    rounded-lg
    transition-colors duration-main
    before:absolute before:inset-0 before:rounded-lg
    before:bg-main-gradient 
    before:opacity-0 
    before:transition-opacity before:duration-main
    hover:before:opacity-100
    z-10 before:-z-10 
    before:animate-[section-gradient-drift_5s_ease-in-out_infinite]  before:bg-size-[200%_200%]
    `}
    >
      {children}
    </Link>
  );
};

export default DropdownLink;
