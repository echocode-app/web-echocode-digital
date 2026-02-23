import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import UniversesList from './UniversesList';
import UniversesImage from './UniversesImage';

const UniversesSection = () => {
  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="max-w-200 mb-2.5">
          <SectionTitle>{'DON׳T JUST DEVELOP GAMES. CREATE UNIVERSES'}</SectionTitle>
        </div>
        <p className="text-main-sm mb-10">
          {
            " Become an architect of game experiences. In our team, you don't just write scripts — you shape the emotions of millions of gamers worldwide."
          }
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6 justify-between">
          <UniversesList />
          <UniversesImage />
        </div>
      </SectionContainer>
    </section>
  );
};

export default UniversesSection;
