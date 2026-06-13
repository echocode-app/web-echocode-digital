'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import CommonFooterForm from './CommonFooterForm/CommonFooterForm';
import VacancyFooterForm from './VacancyFooterForm/VacancyFooterForm';
import SectionTitle from '@/components/UI/section/SectionTitle';

export default function FooterFormWrapper() {
  const t = useTranslations('Layout.Footer');
  const pathname = usePathname();

  const isCareerRoute = pathname === '/career' || pathname.startsWith('/career/');

  if (isCareerRoute) {
    return (
      <>
        <div className="mb-4 md:mb-12 flex flex-col xl:flex-row xl:justify-between xl:items-end w-fit xl:w-full">
          <h2 className="mb-4 xl:mb-0 font-extra font-extrabold text-[32px] md:text-[40px] w-fit leading-none uppercase">
            {t('title')}
          </h2>
          <VacancyFooterForm key={pathname} />
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-between flex-col min-[1068]:flex-row gap-4 pb-10">
      <div className="relative flex flex-col min-[954px]:flex-row min-[1068px]:flex-col justify-between gap-2">
        <div>
          <div className="md:mb-6 max-w-150">
            <SectionTitle>{t('title')}</SectionTitle>
          </div>
          <p className="text-main-sm mb-2 md:mb-0 max-w-122.5 text-white">{t('subtitle')} </p>
        </div>
        <div className="flex items-end">
          <div className="relative w-28.5 h-37 order-1 min-[954px]:order-2 min-[1068px]:order-1">
            <Image
              src={'/images/rabbits/footer.png'}
              alt="CV"
              fill
              sizes="296px"
              className="object-contain scale-x-100 min-[954px]:-scale-x-100 min-[1068px]:scale-x-100"
            />
          </div>

          <Link
            href="mailto:hello@echocode.digital"
            data-text="hello@echocode.digital"
            className="relative order-2 min-[954px]:order-1 min-[1068px]:order-2 inline-block text-main-sm font-semibold text-accent transition-all duration-main
      before:pointer-events-none before:absolute before:inset-0 before:content-[attr(data-text)]
      before:bg-main-gradient before:bg-clip-text before:text-transparent before:opacity-0
      before:animate-[section-gradient-drift_5s_ease-in-out_infinite] before:bg-size-[200%_200%]
      before:transition-opacity before:duration-main
      after:absolute after:left-0 after:bottom-0.5 after:h-px after:w-full
      after:bg-main-gradient after:opacity-0 after:transition-opacity after:duration-main
      after:animate-[section-gradient-drift_5s_ease-in-out_infinite] after:bg-size-[200%_200%]
      hover:before:opacity-100 hover:after:opacity-100
      focus-visible:before:opacity-100 focus-visible:after:opacity-100"
          >
            hello@echocode.digital
          </Link>
        </div>
      </div>
      <CommonFooterForm key={pathname} />
    </div>
  );
}
