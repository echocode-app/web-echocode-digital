import { notFound } from 'next/navigation';

import StaticGradientLine from '@/components/UI/StaticGradientLine';
import handleStaticVacancy from '@/components/sections/career/vacancy/utils/handleStaticVacancy';
import HeroSection from '@/components/sections/career/vacancy/HeroSection';
import ValueSection from '@/components/sections/career/vacancy/ValueSection';
import DescriptionSections from '@/components/sections/career/vacancy/DescriptionSection';
import SelectionSection from '@/components/sections/career/vacancy/SelectionSection';
import CandidateSection from '@/components/sections/career/vacancy/CandidateSection';
import { getPublicVacancyBySlug } from '@/server/vacancies';
import { VacancyData } from '@/components/sections/career/vacancy/types/vacancy';

interface VacancyPageProps {
  params: Promise<{ slug: string }>;
}

const VacancyPage = async ({ params }: VacancyPageProps) => {
  const { slug } = await params;
  const vacancy = await getPublicVacancyBySlug(slug);
  const careerData = handleStaticVacancy(slug);

  if (!vacancy || !careerData || !slug) {
    notFound();
  }

  const { vacancyTitle, level, employmentType, vacancyId, vacancySlug, conditions } = vacancy;
  const { heroSection, valueSection, descriptionSections, selectionSection, translateKey } =
    careerData;

  const vacancyData: VacancyData = {
    vacancyId,
    vacancySlug,
    vacancyTitle,
    level,
    conditions,
  };

  return (
    <>
      <HeroSection
        image={heroSection.image}
        title={vacancyTitle}
        level={level}
        employmentType={employmentType}
      />
      <StaticGradientLine />
      <ValueSection
        title={valueSection.title}
        subtitle={valueSection.subtitle}
        translateKey={translateKey}
      />
      {descriptionSections.map(({ title, values }, i) => (
        <DescriptionSections key={i} title={title} values={values} translateKey={translateKey} />
      ))}
      <SelectionSection selectionList={selectionSection} translateKey={translateKey} />
      <CandidateSection vacancyData={vacancyData} />
    </>
  );
};

export default VacancyPage;
