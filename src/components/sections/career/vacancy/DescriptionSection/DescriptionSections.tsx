import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DescriptionList from './DescriptionList';

import { DescriptionSection } from '../types/vacancy';
import SectionContainer from '@/components/UI/section/SectionContainer';

const DescriptionSections = ({ title, values }: DescriptionSection) => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>{title}</SectionTitle>
        </div>
        <DescriptionList list={values} />
      </SectionContainer>
    </section>
  );
};

export default DescriptionSections;
