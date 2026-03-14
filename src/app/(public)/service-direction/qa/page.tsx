import type { Metadata } from 'next';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import ArmorSection from '@/components/sections/directions/qa/ArmorSection';
import BusinessSection from '@/components/sections/directions/qa/BusinessSection';
import HeroSection from '@/components/sections/directions/qa/HeroSection';
import MetricsSection from '@/components/sections/directions/qa/MetricsSection';
import ModerationSection from '@/components/sections/directions/qa/ModerationSection';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'QA Services',
    description:
      'QA services for mobile and web products, including stability, moderation readiness, automation and performance validation.',
    path: '/service-direction/qa',
    image: '/images/rabbits/hero/qa.png',
  });
}

const QAPage = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <BusinessSection />
      <ModerationSection />
      <ArmorSection />
      <MetricsSection />
    </>
  );
};

export default QAPage;
