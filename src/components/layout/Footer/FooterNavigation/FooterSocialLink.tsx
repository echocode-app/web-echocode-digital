import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import FooterLinkArrow from './FooterLinkArrow';

interface FooterSocialLinkProps {
  children: ReactNode;
  link: string;
}

const FooterSocialLink = ({ children, link }: FooterSocialLinkProps) => {
  return (
    <li>
      <Link
        href={link}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-full items-center gap-1 text-main-base text-base-gray 
        duration-main hover:text-accent focus-visible:text-accent"
      >
        <span>{children}</span>
        <FooterLinkArrow />
      </Link>
    </li>
  );
};

export default FooterSocialLink;
