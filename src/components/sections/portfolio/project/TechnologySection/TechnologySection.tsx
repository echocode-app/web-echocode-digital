import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import TechnologyList from './TechnologyList';

interface TechnologySectionProps {
  list: { title: string; desc: string }[];
  translateKey: string;
}

const TechnologySection = ({ list, translateKey }: TechnologySectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10 md:pb-0">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <TechnologyList list={list} translateKey={translateKey} />
      </SectionContainer>
    </section>
  );
};

export default TechnologySection;
