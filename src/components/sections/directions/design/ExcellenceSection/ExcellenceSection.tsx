import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import ExcellenceList from './ExcellenceList';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ExcellenceImage from './ExcellenceImage';
import ExcellenceRabbitImage from './ExcellenceRabbitImage';
import { useTranslations } from 'next-intl';

const ExcellenceSection = () => {
  const t = useTranslations('DesignPage.ExcellensSection');

  return (
    <section className="pb-10 md:pb-25">
      <div className="relative">
        <ExcellenceRabbitImage />
        <SectionGradientLine height="1" />
      </div>
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className="text-main-sm mb-10">{t('desc')}</p>
        <div className="flex justify-center lg:justify-between">
          <ExcellenceImage />
          <ExcellenceList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default ExcellenceSection;
