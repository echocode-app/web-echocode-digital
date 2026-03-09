import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DominationImage from './DominationImage';
import DominateList from './DominateList';

const DominationSection = () => {
  return (
    <section className="pb-10">
      <SectionContainer>
        <SectionTitle marginBottom="10px">ASO: Dominate the Search Results</SectionTitle>
        <p className="text-main-sm mb-12">
          We transform visibility into real installs. Our ASO strategy is a blend of precise data,
          user psychology, and a deep understanding of App Store and Google Play algorithms.
        </p>
        <ul className="w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-0 justify-between mb-17.5">
          <li className="w-full max-w-120">
            <DominationImage image="/images/directions/igaming/before.png" desc="Before" />
          </li>
          <li className="w-full max-w-120">
            <DominationImage
              image="/images/directions/igaming/after.png"
              desc="After"
              gradient={true}
            />
          </li>
        </ul>
        <DominateList />
      </SectionContainer>
    </section>
  );
};

export default DominationSection;
