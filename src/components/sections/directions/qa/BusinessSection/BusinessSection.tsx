import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import BusinessList from './BusinessList';

const BusinessSection = () => {
  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="mb-8 max-w-205">
          <SectionTitle>{'We don׳t just test features. We protect business nodes'}</SectionTitle>
        </div>
        <p className="text-main-sm mb-8">
          We transform visibility into real installs. Our ASO strategy is a blend of precise data,
          user psychology, and a deep understanding of App Store and Google Play algorithms.
        </p>
        <BusinessList />
      </SectionContainer>
    </section>
  );
};

export default BusinessSection;
