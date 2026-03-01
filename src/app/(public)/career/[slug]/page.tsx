import DescriptionSections from '@/components/sections/vacancy/DescriptionSection/DescriptionSections';
import SelectionSection from '@/components/sections/vacancy/SelectionSection';
import VacancyForm from '@/components/sections/vacancy/VacancyForm/VacancyForm';
import ValueSection from '@/components/sections/vacancy/ValueSection';

import { CareerData } from '@/components/sections/vacancy/types/vacancy';

import qaData from '@/data/vacancy/qa.json';

const VacancyPage = () => {
  const { valueSection, descriptionSections, selectionSection }: CareerData = qaData;

  return (
    <div className="pt-40">
      <ValueSection title={valueSection.title} subtitle={valueSection.subtitle} />
      {descriptionSections.map(({ title, values }, i) => (
        <DescriptionSections key={i} title={title} values={values} />
      ))}
      <SelectionSection selectionList={selectionSection} />
      <VacancyForm vacancy={'qa'} />
    </div>
  );
};

export default VacancyPage;
