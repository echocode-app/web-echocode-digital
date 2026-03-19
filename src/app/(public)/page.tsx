import AnimationLine from '@/components/UI/AnimationLine';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import BasedOnSection from '@/components/sections/home/BasedOnSection';
import DirectionSection from '@/components/sections/home/DirectionsSection';
import HeroSection from '@/components/sections/home/HeroSection';
import LocationSection from '@/components/sections/home/LocationSection';
import PartnersSection from '@/components/sections/home/PartnersSection';
import PortfolioSection from '@/components/sections/home/PortfolioSection';
import ServicesSection from '@/components/sections/home/ServicesSection';

const HomePage = () => {
  return (
    <>
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <AnimationLine />
      <SectionFirstReveal>
        <BasedOnSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <DirectionSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ServicesSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PortfolioSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PartnersSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <LocationSection />
      </SectionFirstReveal>
    </>
  );
};

export default HomePage;
