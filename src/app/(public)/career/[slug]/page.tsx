import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import handleStaticVacancy from '@/components/sections/career/vacancy/utils/handleStaticVacancy';
import HeroSection from '@/components/sections/career/vacancy/HeroSection';
import ValueSection from '@/components/sections/career/vacancy/ValueSection';
import DescriptionSections from '@/components/sections/career/vacancy/DescriptionSection';
import SelectionSection from '@/components/sections/career/vacancy/SelectionSection';
import CandidateSection from '@/components/sections/career/vacancy/CandidateSection';
import { getPublicVacancyBySlug } from '@/server/vacancies';
import { VacancyData } from '@/components/sections/career/vacancy/types/vacancy';
import { buildPageMetadata } from '@/lib/seo/metadata';
import JobPostingJsonLd from '@/components/seo/JobPostingJsonLd';

interface VacancyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VacancyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getPublicVacancyBySlug(slug);

  if (!vacancy) {
    return buildPageMetadata({
      title: 'Career Opportunity',
      description: 'Explore career opportunities at Echocode.',
      path: `/career/${slug}`,
      image: '/images/rabbits/hero/career.png',
    });
  }

  return buildPageMetadata({
    title: `${vacancy.vacancyTitle} ${vacancy.level}`.trim(),
    description: `Apply for the ${vacancy.vacancyTitle} role at Echocode and join a product-focused team building high-impact digital products.`,
    path: `/career/${slug}`,
    image: '/images/rabbits/hero/career.png',
  });
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
      <JobPostingJsonLd
        vacancyTitle={vacancyTitle}
        vacancySlug={vacancySlug}
        level={level}
        conditions={conditions}
        employmentType={employmentType}
        datePosted={vacancy.datePosted}
      />
      <SectionFirstReveal>
        <HeroSection
          image={heroSection.image}
          title={vacancyTitle}
          level={level}
          employmentType={employmentType}
        />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <ValueSection
          title={valueSection.title}
          subtitle={valueSection.subtitle}
          translateKey={translateKey}
        />
      </SectionFirstReveal>
      {descriptionSections.map(({ title, values }, i) => (
        <SectionFirstReveal key={i}>
          <DescriptionSections title={title} values={values} translateKey={translateKey} />
        </SectionFirstReveal>
      ))}
      <SectionFirstReveal>
        <SelectionSection selectionList={selectionSection} translateKey={translateKey} />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <CandidateSection vacancyData={vacancyData} />
      </SectionFirstReveal>
    </>
  );
};

export default VacancyPage;
