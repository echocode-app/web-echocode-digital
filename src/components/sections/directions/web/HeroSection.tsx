import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('WebPage.HeroSection');

  return (
    <section className="pt-33 pb-2">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="max-w-172.5">
              <PageTitle
                fontSizeDesktop="md:text-[46px]"
                leading="leading-[34px] md:leading-[52px]"
              >
                {t('title')}
              </PageTitle>
            </div>
            <p className="font-main text-center md:text-start mt-4 max-w-170">{t('subtitle')}</p>
          </div>
          <div className="relative w-50 h-50 md:min-w-62 md:w-79.5 md:h-79.5">
            <Image
              src={'/images/rabbits/hero/web.png'}
              alt="Web Dev"
              fill
              priority
              sizes="(min-width: 768px) 318px, 200px"
              className="object-cover -scale-x-100"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
