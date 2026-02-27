import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import NavLink from '../NavLink';
import MobileDropdownList from './MobileDropdownList';

interface MobileNavListProps {
  onClose: () => void;
  isOpenDropdown: boolean;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}

const MobileNavList = ({ onClose, isOpenDropdown, setIsOpenDropdown }: MobileNavListProps) => {
  const t = useTranslations('Layout.Header.navigation');
  const locale = useLocale();
  const textSize = locale === 'ua' ? 'text-main-sm font-semibold' : 'text-main-base-link';

  return (
    <ul className="flex flex-col items-center gap-8">
      <li>
        <button
          type="button"
          aria-expanded={isOpenDropdown}
          onClick={() => setIsOpenDropdown((prev) => !prev)}
          className={`relative flex gap-1 mx-auto items-center font-main uppercase text-main-base-link text-center 
            ${textSize}`}
        >
          {t('services')}
          <div className="relative w-5 h-5">
            <Image
              src={'/UI/dropdown.svg'}
              alt="Dropdown"
              fill
              className={`${isOpenDropdown ? 'rotate-x-180' : 'rotate-x-0'} 
              transition-all duration-main`}
            />
          </div>
        </button>

        <MobileDropdownList
          isOpenDropdown={isOpenDropdown}
          onClose={onClose}
          onCloseDropdown={() => setIsOpenDropdown(false)}
        />
      </li>

      <li onClick={onClose}>
        <NavLink link="/portfolio">{t('portfolio')}</NavLink>
      </li>
      <li onClick={onClose}>
        <NavLink link="/partnership">{t('partnership')}</NavLink>
      </li>
      <li onClick={onClose}>
        <NavLink link="/team">{t('team')}</NavLink>
      </li>
      <li onClick={onClose}>
        <NavLink link="/career">{t('career')}</NavLink>
      </li>
    </ul>
  );
};

export default MobileNavList;
