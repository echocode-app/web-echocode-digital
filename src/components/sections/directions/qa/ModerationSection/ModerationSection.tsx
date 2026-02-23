import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ModerationList from './ModerationList';
import SectionImage from './SectionImage';

const ModerationSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-2.5">
          <SectionTitle>Pass moderation fast</SectionTitle>
        </div>
        <p className="mb-10 text-main-sm">
          App Store or Google Play rejection means weeks of downtime and lost budget. We know the
          pitfalls of Apple and Google guidelines, preparing your product for approval in advance.
        </p>
        <div className="flex gap-10 lg:gap-0 flex-col lg:flex-row items-center justify-between">
          <SectionImage />
          <ModerationList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default ModerationSection;
