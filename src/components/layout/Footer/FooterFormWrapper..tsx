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
  const tTitle = useTranslations('ProjectModal');
  const pathname = usePathname();

  const isVacancyPage = pathname.startsWith('/career/') && pathname !== '/career';

  if (isVacancyPage) {
    return (
      <>
        <div className="mb-4 md:mb-12 flex flex-col xl:flex-row xl:justify-between xl:items-end w-fit xl:w-full">
          <h2 className="mb-4 xl:mb-0 font-extra font-extrabold text-[40px] w-fit leading-none">
            {t('title')}
          </h2>
          <VacancyFooterForm key={pathname} />
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-between flex-col min-[1068]:flex-row gap-2 pb-10">
      <div className="relative">
        <div className="md:mb-2.5">
          <SectionTitle>{tTitle('title')}</SectionTitle>
        </div>
        <p className="text-main-sm mb-2 md:mb-8 max-w-145 text-white">
          {tTitle('subtitle')}{' '}
          <Link
            href="mailto:hello@echocode.digital"
            data-text="hello@echocode.digital"
            className="relative inline-block font-semibold text-accent transition-all duration-main
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
        </p>

        <div className=" md:absolute right-1/2 md:right-0 md:bottom-0 md:translate-x-16 min-[1068px]:translate-x-0">
          <div className="relative w-55.5 h-37 mx-auto md:mx-0">
            <Image
              src={'/images/rabbits/resume.png'}
              alt="CV"
              fill
              sizes="296px"
              className="object-contain -scale-x-100 md:scale-x-100 min-[1068px]:-scale-x-100"
            />
          </div>
        </div>
      </div>
      <CommonFooterForm key={pathname} />
    </div>
  );
}
