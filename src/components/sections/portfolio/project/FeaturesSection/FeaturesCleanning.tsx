import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';

const FeaturesCleanning = () => {
  const t = useTranslations('FeaturesCleaning');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="text-[#E3E4E6]">
          <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        </div>
        <div className="flex flex-wrap justify-center  items-end gap-6">
          <div className="flex flex-col gap-3 max-w-122 w-full">
            <h3 className="font-title text-[#E3E4E6] uppercase font-bold">{t('subtitle')}</h3>

            <div className="p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
              {t('feature01.title')}
            </div>
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            {t('feature02.title')}
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            {t('feature03.title')}
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            {t('feature04.title')}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default FeaturesCleanning;
