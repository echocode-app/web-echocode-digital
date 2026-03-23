import { useTranslations } from 'next-intl';

import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DescriptionList from './DescriptionList';
import SectionContainer from '@/components/UI/section/SectionContainer';

import { DescriptionSection } from '../types/vacancy';

interface DescriptionSectionsProps extends DescriptionSection {
  translateKey: string;
}

const DescriptionSections = ({ title, values, translateKey }: DescriptionSectionsProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t(title)}</SectionTitle>
        <DescriptionList list={values} translateKey={translateKey} />
      </SectionContainer>
    </section>
  );
};

export default DescriptionSections;
