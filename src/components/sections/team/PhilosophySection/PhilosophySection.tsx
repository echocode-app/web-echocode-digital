import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';

const PhilosophySection = () => {
  const t = useTranslations('TeamPage.philosophySection');

  return (
    <section className="pt-6 md:pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="flex flex-wrap gap-10 lg:gap-3 justify-center">
          <div className="max-w-127">
            <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
            <p className="max-w-105 text-main-sm mb-5">{t('subtitle')}</p>
            <ul className="flex flex-wrap gap-2 text-accent text-[13px]">
              <li>#Product engineers</li>
              <li>#Designers</li>
              <li>#QA engineers</li>
              <li>#Growth & ASO specialists</li>
            </ul>
          </div>
          <div className="p-3 max-w-120 border-2 border-accent rounded-secondary">
            <p className="font-title text-[16px] md:text-[20px] uppercase font-bold">{t('desc')}</p>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default PhilosophySection;
