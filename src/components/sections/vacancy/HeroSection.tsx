import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';
import { VacancyHeroSection } from './types/vacancy';

interface HeroSectionProps extends VacancyHeroSection {
  title: string;
  level?: string;
  employmentType: string;
}

const HeroSection = ({ title, level, employmentType, image }: HeroSectionProps) => {
  return (
    <section className="pt-31.5">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-170">
            <h2 className="text-title-3xl md:text-title-4xl lg:text-title-6xl font-title text-center md:text-left">
              {title}
            </h2>
            <p className="text-title-3xl md:text-title-4xl lg:text-title-6xl font-title text-center md:text-left">
              {level && level}
            </p>
            <p className="text-center md:text-left font-title mt-4 text-title-sm">
              {employmentType && employmentType}
            </p>
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
