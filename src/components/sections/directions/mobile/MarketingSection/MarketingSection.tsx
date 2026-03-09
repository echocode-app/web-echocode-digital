import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MarketingList from './MarketingList';

const MarketingSection = () => {
  return (
    <section className="pb-10 md:pb-2">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">
          GROWTH <span className="text-[12px] md:text-[18px]">&</span> MARKETING
        </SectionTitle>
        <p className="mb-10 text-main-sm">
          Professional development is only half of the story. We help products become visible in
          stores using proven optimization methods and strategic promotion.
        </p>
        <MarketingList />
      </SectionContainer>
    </section>
  );
};

export default MarketingSection;
