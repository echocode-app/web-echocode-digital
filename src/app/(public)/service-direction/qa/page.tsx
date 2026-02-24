import StaticGradientLine from '@/components/UI/StaticGradientLine';
import ArmorSection from '@/components/sections/directions/qa/ArmorSection';
import BusinessSection from '@/components/sections/directions/qa/BusinessSection';
import HeroSection from '@/components/sections/directions/qa/HeroSection';
import MetricsSection from '@/components/sections/directions/qa/MetricsSection';
import ModerationSection from '@/components/sections/directions/qa/ModerationSection';

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
