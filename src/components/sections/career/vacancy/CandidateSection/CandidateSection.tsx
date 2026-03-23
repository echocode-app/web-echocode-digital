import { useTranslations } from 'next-intl';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import { VacancyData } from '../types/vacancy';
import VacancyForm from './CandidateForm';
import VacancyImage from './CandidateImage';

interface CandidateSectionProps {
  vacancyData: VacancyData;
}

const CandidateSection = ({ vacancyData }: CandidateSectionProps) => {
  const t = useTranslations('VacancyCommon.vacancyForm');

  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" fullWidth />
      <div
        className="relative max-w-318 px-8 mx-auto flex flex-col  xl:flex-row xl:justify-between 
      items-center xl:items-start gap-58 xl:gap-40"
      >
        <h2 className=" text-[26px] min-[490px]:text-[40px] text-left max-w-149.5 w-full font-extra uppercase font-extrabold tracking-[-0.8px]">
          {t('title')}
        </h2>
        <VacancyImage />
        <VacancyForm vacancyData={vacancyData} />
      </div>
    </section>
  );
};

export default CandidateSection;
