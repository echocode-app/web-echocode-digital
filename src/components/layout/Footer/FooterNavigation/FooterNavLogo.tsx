'use client';

import Link from 'next/link';

import { useScrollToTop } from '@/hooks/useScrollToTop';

const FooterNavLogo = () => {
  const scrollToTop = useScrollToTop('/');

  return (
    <Link
      href={'/'}
      onClick={scrollToTop}
      className="block mb-2.5 font-wadik text-title-xs text-accent"
    >
      Echocode.app
    </Link>
  );
};

export default FooterNavLogo;
