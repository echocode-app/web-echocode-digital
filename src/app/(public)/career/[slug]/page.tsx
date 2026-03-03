import { notFound } from 'next/navigation';

import StaticGradientLine from '@/components/UI/StaticGradientLine';
import handleStaticVacancy from '@/components/sections/career/vacancy/utils/handleStaticVacancy';
import HeroSection from '@/components/sections/career/vacancy/HeroSection';
import ValueSection from '@/components/sections/career/vacancy/ValueSection';
import DescriptionSections from '@/components/sections/career/vacancy/DescriptionSection';
import SelectionSection from '@/components/sections/career/vacancy/SelectionSection';
import VacancyForm from '@/components/sections/career/vacancy/VacancyForm';

import { Vacancy } from '@/components/sections/career/VacanciesSection/types/vacancies';

const vacancies: Vacancy[] = [
  {
    hotPosition: true,
    vacancyTitle: 'iOS Developer ',
    level: '(Trainee)',
    conditions: ['Engineering', 'Remote'],
    vacancyId: 'iosdev',
    vacancySlug: 'iosdev',
    employmentType: 'Remote ／ Full-time',
  },
  {
    vacancyTitle: 'QA Engineer ',
    level: '(Middle)',
    conditions: ['Quality Assurance', 'Remote'],
    vacancyId: 'qaengineer',
    vacancySlug: 'qaengineer',
    employmentType: 'Remote ／ Full-time',
  },
  {
    vacancyTitle: 'UI／UX Designer',
    conditions: ['Design', 'Remote'],
    vacancyId: 'designer',
    vacancySlug: 'designer',
    employmentType: 'Remote ／ Full-time',
  },
];

interface VacancyPageProps {
  params: Promise<{ slug: string }>;
}

const VacancyPage = async ({ params }: VacancyPageProps) => {
  const { slug } = await params;
  const vacancy = vacancies.find(
    ({ vacancySlug, vacancyId }) => vacancySlug === slug || vacancyId === slug,
  );
  const careerData = handleStaticVacancy(slug);

  if (!vacancy || !careerData || !slug) {
    notFound();
  }

  const { vacancyTitle, level, employmentType, vacancyId, vacancySlug, conditions } = vacancy;
  const { heroSection, valueSection, descriptionSections, selectionSection } = careerData;

  const formData = {
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
      <ValueSection title={valueSection.title} subtitle={valueSection.subtitle} />
      {descriptionSections.map(({ title, values }, i) => (
        <DescriptionSections key={i} title={title} values={values} />
      ))}
      <SelectionSection selectionList={selectionSection} />
      <VacancyForm vacancyData={formData} />
    </>
  );
};

export default VacancyPage;
