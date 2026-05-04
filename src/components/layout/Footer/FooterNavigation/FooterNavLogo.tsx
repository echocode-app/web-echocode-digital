'use client';

import { Link } from '@/i18n/navigation';

import { useScrollToTop } from '@/hooks/useScrollToTop';
import Image from 'next/image';

const FooterNavLogo = () => {
  const scrollToTop = useScrollToTop('/');

  return (
    <Link
      href={'/'}
      onClick={scrollToTop}
      className="group flex gap-2 mb-2.5 font-wadik text-title-xs text-accent"
    >
      <span className="bg-main-gradient bg-clip-text text-transparent bg-main-gradient-animated ">
        .DIGITAL
      </span>
      <Image
        src={'/UI/link-icon-gradient.svg'}
        alt="Rigth Arrow"
        width={10}
        height={10}
        className="group-hover:scale-120 duration-main  will-change-transform"
      />
    </Link>
  );
};

export default FooterNavLogo;
