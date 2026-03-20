import { useLocale, useTranslations } from 'next-intl';

import DropdownList from './DropdownList';
import NavLink from './NavLink';

export const navLinkBaseClass =
  'relative font-main uppercase ' +
  'bg-main-gradient bg-clip-text bg-transparent ' +
  'transition-all duration-main ' +
  'group-hover:text-transparent group-hover:bg-clip-text group-hover:after:opacity-100 ' +
  'hover:text-transparent hover:bg-clip-text ' +
  'after:absolute after:left-0 after:-bottom-[-2px] after:h-px after:w-full ' +
  'after:bg-main-gradient after:opacity-0 after:transition-opacity ' +
  'after:duration-main hover:after:opacity-100 ' +
  'after:[animation:section-gradient-drift_5s_ease-in-out_infinite]  after:bg-size-[200%_200%] [animation:section-gradient-drift_5s_ease-in-out_infinite]  bg-size-[200%_200%] ';

const NavList = () => {
  const t = useTranslations('Layout.Header.navigation');
  const locale = useLocale();
  const textSize = locale === 'ua' ? 'text-main-sm font-semibold' : 'text-main-base-link';

  return (
    <nav>
      <ul className="flex gap-4 xl:gap-8">
        <li className="relative group z-100">
          <button
            type="button"
            data-text="Service Directions"
            aria-haspopup="menu"
            className={`${navLinkBaseClass} ${textSize}`}
          >
            {t('services')}
          </button>
          <DropdownList />
        </li>
        <li>
          <NavLink link={'/portfolio'}>{t('portfolio')}</NavLink>
        </li>
        <li>
          <NavLink link={'/partnership'}>{t('partnership')}</NavLink>
        </li>
        <li>
          <NavLink link={'/team'}>{t('team')}</NavLink>
        </li>
        <li>
          <NavLink link={'/career'}>{t('career')}</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavList;
