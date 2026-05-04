import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import TypedHeroHeading from '@/components/UI/TypedHeroHeading';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import { AboutSectionECommerse } from '@/components/sections/portfolio/project/AboutSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection';
import FeaturesSection from '@/components/sections/portfolio/project/FeaturesSection/FeaturesSection';
import ScreensSection from '@/components/sections/portfolio/project/ScreensSection';
import ProptotypeSection from '@/components/sections/portfolio/project/PrototypeSection';
import TechnologySection from '@/components/sections/portfolio/project/TechnologySection';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

import implementations from '@/data/portfolio/projects/implementations/e-commerce.json';
import challenges from '@/data/portfolio/projects/challenges/e-commerce.json';
import planning from '@/data/portfolio/projects/planning/e-commerce.json';
import features from '@/data/portfolio/projects/features/e-commerce.json';
import technologies from '@/data/portfolio/projects/technologies/e-commerce.json';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'E-commerce Case Study',
    description:
      'Review Echocode’s e-commerce case study with product strategy, implementation, prototype flows and technology choices.',
    path: '/portfolio/e-commers',
    image: '/images/projects/e-commers/screens.png',
  });
}

const ECommers = () => {
  const t = useTranslations('ImplementationECommerce');

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: 'E-commerce', path: '/portfolio/e-commers' },
        ]}
      />
      <SectionFirstReveal>
        <section className="pt-42 pb-37.5">
          <TypedHeroHeading
            text="E-commerce"
            className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-wadik text-center uppercase"
          />
        </section>
      </SectionFirstReveal>
      <SectionFirstReveal>
        <AboutSectionECommerse />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ImplementationSection
          list={implementations}
          subtitle={t('subtitle')}
          translateKey="ImplementationECommerce"
        />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ChallengesSection
          list={challenges}
          image="/images/projects/e-commers/challenges.jpg"
          position="0% 50%"
          translateKey="ChallengesECommerce"
        />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PlanningSection
          list={planning}
          translateKey="PlanningECommerce"
          image={'/images/projects/e-commers/planning.png'}
          imageStyle="relative w-full max-w-157.5 aspect-157.5/139"
        />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <FeaturesSection list={features} translateKey="FeaturesECommerce" />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ScreensSection imagePath="/images/projects/e-commers/screens.png" />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ProptotypeSection
          translateKey="PrototypeECommerce"
          leftBgImage={'/images/projects/e-commers/left-bg.png'}
          rightBgImage={'/images/projects/e-commers/right-bg.png'}
        >
          <iframe
            src="https://embed.figma.com/proto/8M2Etv0l9Hgs656uoInQmT/e-commerce?scaling=scale-down&content-scaling=fixed&page-id=0%3A1&node-id=0-8167&starting-point-node-id=0%3A8167&embed-host=share&hide-ui=1"
            allowFullScreen
            title="Interactive prototype of the E-commerce App"
            width="354px"
            height="797px"
            className="scale-70 xl:scale-100"
          />
        </ProptotypeSection>
      </SectionFirstReveal>
      <SectionFirstReveal>
        <TechnologySection list={technologies} translateKey="TechnologyECommerce" />
      </SectionFirstReveal>
    </>
  );
};

export default ECommers;
