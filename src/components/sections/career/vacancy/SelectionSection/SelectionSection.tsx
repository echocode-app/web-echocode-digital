import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SelectionList from './SelectionList';
import { SelectionStep } from '../types/vacancy';
import SectionTitle from '@/components/UI/section/SectionTitle';
import { useTranslations } from 'next-intl';

interface SelectionSectionProps {
  selectionList: SelectionStep[];
  translateKey: string;
}

const SelectionSection = ({ selectionList, translateKey }: SelectionSectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10 md:pb-30.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="72px">{t('selectionSection.title')}</SectionTitle>
        <SelectionList list={selectionList} translateKey={translateKey} />
      </SectionContainer>
    </section>
  );
};

export default SelectionSection;
