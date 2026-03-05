import SectionTitle from '@/components/UI/section/SectionTitle';
import Image from 'next/image';

interface ScreensSection {
  imagePath: string;
}

const ScreensSection = ({ imagePath }: ScreensSection) => {
  return (
    <section className="pb-10 md:pb-25">
      <div className="relative max-w-322.5 w-full min-h-200 aspect-1290/986 overflow-hidden mx-auto">
        <div className="absolute top-8 -translate-x-1/2 left-1/2 z-30">
          <SectionTitle>Screens</SectionTitle>
        </div>

        <div className="absolute top-0 left-0 w-full h-24 md:h-40 bg-linear-to-b from-black to-transparent z-20" />
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-40 bg-linear-to-t from-black to-transparent z-20" />

        <div className="hidden xl:block absolute top-0 left-0 h-full w-24 md:w-40 bg-linear-to-r from-black to-transparent z-20" />
        <div className="hidden xl:block absolute top-0 right-0 h-full w-24 md:w-40 bg-linear-to-l from-black to-transparent z-20" />
        <Image
          src={imagePath}
          alt="Screens"
          sizes="1290px"
          width={1290}
          height={986}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                 min-w-322.5 min-h-246.5 max-w-none object-cover"
        />
      </div>
    </section>
  );
};

export default ScreensSection;
