import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { AboutSectionFood } from '@/components/sections/portfolio/project/AboutSection';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection/PlanningSection';
import FeaturesSection from '@/components/sections/portfolio/project/FeaturesSection';
import ScreensSection from '@/components/sections/portfolio/project/ScreensSection';
import ProptotypeSection from '@/components/sections/portfolio/project/PrototypeSection';
import TechnologySection from '@/components/sections/portfolio/project/TechnologySection';
import { buildPageMetadata } from '@/lib/seo/metadata';

import implementations from '@/data/portfolio/projects/implementations/food.json';
import challenges from '@/data/portfolio/projects/challenges/food.json';
import planning from '@/data/portfolio/projects/planning/food.json';
import features from '@/data/portfolio/projects/features/food.json';
import technologies from '@/data/portfolio/projects/technologies/food.json';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Food & Drink Case Study',
    description:
      'See how Echocode designed and delivered a food and drink product experience, from product planning to prototype and implementation.',
    path: '/portfolio/food',
    image: '/images/projects/food/screens.png',
  });
}

const Food = () => {
  const t = useTranslations('ImplementationFood');

  return (
    <>
      <section className="pt-42 pb-37.5">
        <h1 className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-wadik text-center">
          FOOD ＆ DRINK
        </h1>
      </section>
      <AboutSectionFood />
      <ImplementationSection
        list={implementations}
        subtitle={t('subtitle')}
        translateKey="ImplementationFood"
      />
      <ChallengesSection
        list={challenges}
        image="/images/projects/food/challenges.jpg"
        position="0% 50%"
        translateKey="ChallengesFood"
      />
      <PlanningSection
        list={planning}
        image={'/images/projects/food/planning.png'}
        imageStyle="relative w-full max-w-[570px] aspect-570/600"
        translateKey="PlanningFood"
      />
      <FeaturesSection list={features} translateKey="FeaturesFood" />
      <ScreensSection imagePath="/images/projects/food/screens.png" />
      <ProptotypeSection
        leftBgImage={'/images/projects/food/left-bg.png'}
        rightBgImage={'/images/projects/food/right-bg.png'}
        translateKey="PrototypeFood"
      >
        <iframe
          src="https://embed.figma.com/proto/HQTlFNXLE1fFRAXwGSdvwf/Prototype-Food-Drink?page-id=0%3A1&node-id=1-2785&p=f&viewport=365%2C45%2C0.04&embed-host=share&hide-ui=1"
          allowFullScreen
          title="Interactive prototype of the Food App"
          width="354px"
          height="797px"
          className="scale-70 xl:scale-100"
        />
      </ProptotypeSection>
      <TechnologySection list={technologies} translateKey="TechnologyFood" />
    </>
  );
};

export default Food;
