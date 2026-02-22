import Link from 'next/link';

import NavList from './NavList';
import MobileMenu from './MobileMenu';

import LanguageSwitcher from '@/components/UI/LanguageSwitcher';
import Logo from '@/components/UI/Logo';
import SectionContainer from '@/components/UI/section/SectionContainer';

const Header = () => {
  return (
    <header
      className="fixed py-11  w-full z-100 before:absolute before:inset-0
    before:bg-header-gradient
    before:backdrop-blur-[6px]
    before:z-0"
    >
      <SectionContainer>
        <div className="flex justify-between items-center z-10">
          <Link href={'/'} className="flex items-center lg:mr-9.25 gap-3 z-10">
            <Logo />
            <p className="font-wadik hidden xl:block text-title-xs">Echocode.app</p>
          </Link>
          <div className="hidden md:block">
            <NavList />
          </div>
          <MobileMenu />
          <div className="z-10 hidden md:block">
            <LanguageSwitcher />
          </div>
        </div>
      </SectionContainer>
    </header>
  );
};

export default Header;
