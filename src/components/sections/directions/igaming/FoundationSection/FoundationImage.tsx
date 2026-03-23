import Image from 'next/image';

const FoundationImage = () => {
  return (
    <div className="relative w-full md:w-120  h-50 md:h-60.5">
      <div className="absolute w-full md:w-120 h-65 md:h-79 ">
        <Image
          src={'/images/directions/igaming/foundation.png'}
          alt="Foundation"
          fill
          className="object-contain -translate-y-19 mask-[linear-gradient(0deg,transparent_4%,black_20%)]"
        />
      </div>
    </div>
  );
};

export default FoundationImage;
