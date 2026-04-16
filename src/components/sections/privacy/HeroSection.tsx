import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="pt-33 md:pt-33.5 md:pb-9.75">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-170 mb-4">
            <PageTitle>Privacy Policy</PageTitle>
          </div>
          <div className="relative mb-4 md:mb-0 w-45 h-56.75 md:w-55.5 md:min-w-55.5 md:h-69.25">
            <Image
              src={'/images/rabbits/hero/privacy.png'}
              alt="Portfolio"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
