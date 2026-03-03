import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import ChallengesList from './ChallengesList';
import SectionTitle from '@/components/UI/section/SectionTitle';
import Image from 'next/image';

interface ChallengesSectionProps {
  list: { title: string; subtitle: string }[];
  image: string;
  position: string;
}

const ChallengesSection = ({ list, image, position }: ChallengesSectionProps) => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex justify-center lg:justify-between">
          <div className="max-w-141.5">
            <div className="mb-6">
              <SectionTitle>Challenges We Solved</SectionTitle>
            </div>
            <ChallengesList list={list} />
          </div>
          <div className="hidden lg:block relative aspect-394/504 w-full min-[458px]:w-98.5 min-[458px]:h-126">
            <Image
              src={image}
              alt="Challenges"
              fill
              sizes="1000px"
              className="object-cover rounded-secondary"
              style={{ objectPosition: position }}
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default ChallengesSection;
