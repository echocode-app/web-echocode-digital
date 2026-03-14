'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ToggleBarBtnProps {
  setOpenCategories: (open: boolean) => void;
  isOpen: boolean;
}

const ToggleBarBtn = ({ setOpenCategories, isOpen }: ToggleBarBtnProps) => {
  const t = useTranslations('PortfolioPage.ProjectsSection');

  return (
    <button
      onClick={() => setOpenCategories(!isOpen)}
      className="flex items-center px-3 justify-between max-w-51 min-[560px]:max-w-40 md:max-w-51 w-full h-9.5 border border-white
       rounded-secondary text-main-sm hover:border-accent duration-main cursor-pointer"
    >
      <p>{t('niche')}</p>
      <Image
        src={'/UI/chevron-down.svg'}
        alt="Chevron"
        width={12}
        height={20}
        className={`${isOpen ? 'rotate-x-0' : 'rotate-x-180'} 
              transition-all duration-main`}
      />
    </button>
  );
};

export default ToggleBarBtn;
