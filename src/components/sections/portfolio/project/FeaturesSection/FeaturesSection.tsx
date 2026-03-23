import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import FeaturesList from './FeaturesList';

interface FeaturesSectionProps {
  list: { title: string; desc: string }[];
  translateKey: string;
}

const FeaturesSection = ({ list, translateKey }: FeaturesSectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="text-[#E3E4E6]">
          <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        </div>
        <FeaturesList list={list} translateKey={translateKey} />
      </SectionContainer>
    </section>
  );
};

export default FeaturesSection;
