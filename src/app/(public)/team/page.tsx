import type { Metadata } from 'next';

import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/team/HeroSection';
import PhilosophySection from '@/components/sections/team/PhilosophySection';
import StepsSection from '@/components/sections/team/StepsSection';
import TransparencySection from '@/components/sections/team/TransparencySection';
import WorkSection from '@/components/sections/team/WorkSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Team',
    description:
      'Meet the Echocode team: product-minded engineers, designers and QA specialists focused on building scalable digital products.',
    path: '/team',
    image: '/images/rabbits/hero/team.png',
  });
}

const Team = () => {
  return (
    <>
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <PhilosophySection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <WorkSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <StepsSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <TransparencySection />
      </SectionFirstReveal>
    </>
  );
};

export default Team;
