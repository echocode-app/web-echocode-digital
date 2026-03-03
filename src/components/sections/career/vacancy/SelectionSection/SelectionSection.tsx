import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SelectionList from './SelectionList';
import { SelectionStep } from '../types/vacancy';
import SectionTitle from '@/components/UI/section/SectionTitle';

interface SelectionSectionProps {
  selectionList: SelectionStep[];
}

const SelectionSection = ({ selectionList }: SelectionSectionProps) => {
  return (
    <section className="pb-10 md:pb-30.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-18">
          <SectionTitle>Selection stages</SectionTitle>
        </div>
        <SelectionList list={selectionList} />
      </SectionContainer>
    </section>
  );
};

export default SelectionSection;
