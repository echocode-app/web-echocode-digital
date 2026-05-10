'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import MobaileNavList from './MobileNavList';
import LanguageSwitcher from '@/components/UI/LanguageSwitcher';
import Logo from '@/components/UI/Logo';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const scrollToTop = useScrollToTop('/');

  useLockBodyScroll(isOpen);

  const handleCloseAll = () => {
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  const handleToggleMenu = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsOpenDropdown(false);
      }
      return next;
    });
  };

  const handleLogoClick = () => {
    handleCloseAll();
    scrollToTop();
  };

  return (
    <>
      <button
        onClick={handleToggleMenu}
        className={`md:hidden relative w-10 h-10 z-400 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Open menu"
      >
        <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-main">
          <Image src={'/UI/burger-menu.svg'} width={40} height={40} alt="Menu" />
        </span>
      </button>

      <div
        className={`${isOpen ? 'translate-x-0' : 'translate-x-full'}
         md:hidden fixed top-0 left-0 w-full h-screen py-11 px-4
         backdrop-blur-md bg-header-gradient z-300 bg-black
          transition-all duration-main overflow-x-scroll
         `}
      >
        <div className="flex items-center justify-between mb-7">
          <Link href={'/'} onClick={handleLogoClick}>
            <Logo />
          </Link>
          <button onClick={handleToggleMenu} className="relative w-10 h-10" aria-label="Close menu">
            <span className="absolute inset-0 flex items-center justify-center">
              <Image src={'/UI/close.svg'} width={30} height={30} alt="Close" />
            </span>
          </button>
        </div>
        <MobaileNavList
          onClose={handleCloseAll}
          isOpenDropdown={isOpenDropdown}
          setIsOpenDropdown={setIsOpenDropdown}
        />
        <div className="mt-8 flex justify-start">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
