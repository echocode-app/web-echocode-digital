import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

interface FooterNavLinkProps {
  children: ReactNode;
  link: string;
}

const FooterNavLink = ({ children, link }: FooterNavLinkProps) => {
  return (
    <li>
      <Link
        href={link}
        className="block w-full text-main-base text-base-gray hover:text-accent duration-main"
      >
        {children}
      </Link>
    </li>
  );
};

export default FooterNavLink;
