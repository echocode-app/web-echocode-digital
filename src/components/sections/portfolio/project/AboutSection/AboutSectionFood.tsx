import Image from 'next/image';
import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';

const AboutSectionFood = () => {
  const t = useTranslations('AboutSectionFood');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0 mb-3">
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title uppercase font-bold">{t('aboutProject.title')}</h3>
            <p className="text-main-sm text-gray75">{t('aboutProject.description')}</p>
          </div>
          <div className="flex justify-center w-36.5 md:w-98.5 lg:pl-15.5 lg:pr-16">
            <div className="relative w-36.5 h-86.5">
              <Image
                src="/images/projects/right-phone.png"
                alt="right-phone"
                fill
                className="object-contain rotate-22"
              />
              <div className="absolute -top-2.25 -left-16 w-66.5 h-90">
                <Image
                  src="/images/projects/food/right-screen.png"
                  alt="screen"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0">
          <div className="flex justify-center w-36.5 md:w-98.5 lg:h-59 lg:pl-12.5 lg:pr-19.5 order-1 lg:order-0">
            <div className="relative w-36.5 h-86.5">
              <Image
                src={'/images/projects/left-phone.png'}
                alt="left-phone"
                fill
                className="-rotate-22 absolute lg:-translate-y-30"
              />

              <div className="absolute -top-2.25 -left-14 lg:-top-32.25 lg:-left-14 w-66.5 h-90">
                <Image
                  src="/images/projects/food/left-screen.png"
                  alt="screen"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title uppercase font-bold">{t('projectIdea.title')}</h3>
            <p className="mb-0.5  text-main-sm text-gray75">{t('projectIdea.intro')}</p>
            <ul className="flex flex-col gap-0.5 text-main-sm text-gray75">
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> {t('projectIdea.list.item1')}
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> {t('projectIdea.list.item2')}
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> {t('projectIdea.list.item3')}
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> {t('projectIdea.list.item4')}
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> {t('projectIdea.list.item5')}
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default AboutSectionFood;
