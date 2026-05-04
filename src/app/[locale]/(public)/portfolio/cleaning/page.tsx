import type { Metadata } from 'next';

import TypedHeroHeading from '@/components/UI/TypedHeroHeading';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import AboutSectionCleaning from '@/components/sections/portfolio/project/AboutSection/AboutSectionCleaning';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import FeaturesCleanning from '@/components/sections/portfolio/project/FeaturesSection/FeaturesCleanning';
import { ImplementationCleaningSection } from '@/components/sections/portfolio/project/ImplementationSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection/PlanningSection';
import ProptotypeSection from '@/components/sections/portfolio/project/PrototypeSection';
import ScreensSection from '@/components/sections/portfolio/project/ScreensSection';
import TechnologySection from '@/components/sections/portfolio/project/TechnologySection';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

import challenges from '@/data/portfolio/projects/challenges/cleaning.json';
import planning from '@/data/portfolio/projects/planning/cleaning.json';
import technologies from '@/data/portfolio/projects/technologies/cleaning.json';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Cleaning App Case Study',
    description:
      'Explore Echocode’s cleaning app case study covering product design, implementation, interactive prototype and delivery details.',
    path: '/portfolio/cleaning',
    image: '/images/projects/cleaning/screens.png',
  });
}

const Cleaning = () => {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: 'Cleaning App', path: '/portfolio/cleaning' },
        ]}
      />
      <SectionFirstReveal>
        <section className="pt-42 pb-37.5">
          <TypedHeroHeading
            text="CLEANING-APP"
            className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-wadik text-center"
          />
        </section>
      </SectionFirstReveal>
      <SectionFirstReveal>
        <AboutSectionCleaning />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ImplementationCleaningSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ChallengesSection
          list={challenges}
          image="/images/projects/cleaning/challenges.png"
          position="50% 50%"
          translateKey="ChallengesCleaning"
        />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PlanningSection
          list={planning}
          translateKey="PlanningCleaning"
          image={'/images/projects/cleaning/planning.png'}
          imageStyle="relative w-full max-w-[570px] aspect-570/600"
        />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <FeaturesCleanning />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ScreensSection imagePath="/images/projects/cleaning/screens.png" />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ProptotypeSection
          translateKey="PrototypeCleaning"
          leftBgImage={'/images/projects/cleaning/left-bg.png'}
          rightBgImage={'/images/projects/cleaning/right-bg.png'}
        >
          <iframe
            src="https://embed.figma.com/proto/DSZc6u4EWXyp9DqX1F5qQr/Prototype-Cleaning?scaling=none&content-scaling=fixed&page-id=0%3A1&node-id=1-4827&starting-point-node-id=1%3A4827&embed-host=share&hide-ui=1"
            allowFullScreen
            title="Interactive prototype of the Cleaning App"
            width="354px"
            height="797px"
            className="scale-70 xl:scale-100"
          />
        </ProptotypeSection>
      </SectionFirstReveal>
      <SectionFirstReveal>
        <TechnologySection list={technologies} translateKey="TechnologyCleaning" />
      </SectionFirstReveal>
    </>
  );
};

export default Cleaning;
