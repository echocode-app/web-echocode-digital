import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';

import { VacancyHeroSection } from './types/vacancy';

interface HeroSectionProps extends VacancyHeroSection {
  title?: string;
  level?: string | null;
  employmentType?: string;
}

const HeroSection = ({ title, level, employmentType, image }: HeroSectionProps) => {
  return (
    <section className="pt-31.5">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-170">
            <h2 className="text-title-3xl md:text-title-4xl lg:text-title-6xl font-wadik text-center md:text-left">
              {title ? title : 'Vacancy'}
            </h2>
            {level && (
              <p className="text-title-3xl md:text-title-4xl lg:text-title-6xl font-wadik text-center md:text-left">
                ({level})
              </p>
            )}
            {employmentType && (
              <p className="text-center md:text-left font-wadik mt-4 text-title-sm">
                {employmentType}
              </p>
            )}
          </div>
          <div className="relative w-50 h-50 md:min-w-81 md:h-81">
            <Image src={image.path} alt="Vacancy" fill priority className="object-contain" />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
