import Image from 'next/image';

const StaticHeroBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="
        absolute top-31 left-1/2
        h-[48vh] w-screen
        max-h-173.5 max-w-190
        -translate-x-1/2
        backdrop-blur-[10px]
        md:top-20 md:h-[76vh] md:w-[70vw]
        -z-10
      "
    >
      <div className="relative h-full w-full">
        <Image src="/UI/backgrounds/hero-bg.png" alt="" priority fill className="object-cover" />
      </div>
    </div>
  );
};

export default StaticHeroBackground;
