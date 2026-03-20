'use client';

import Link from 'next/link';

import Logo from '@/components/UI/Logo';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const HeaderLogo = () => {
  const scrollToTop = useScrollToTop('/');

  return (
    <Link href={'/'} className="flex items-center lg:mr-9.25 gap-3 z-10" onClick={scrollToTop}>
      <Logo />
      <p className="font-wadik hidden xl:block text-title-xs uppercase">echocode.digital</p>
    </Link>
  );
};

export default HeaderLogo;
