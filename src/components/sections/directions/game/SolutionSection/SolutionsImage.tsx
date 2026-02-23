import Image from 'next/image';

const SolutionsImage = () => {
  return (
    <div className="hidden lg:block relative w-86.5 h-130 overflow-hidden">
      <Image
        src={'/images/directions/game/solutions.png'}
        alt="IGaming"
        fill
        className="object-contain"
      />
    </div>
  );
};

export default SolutionsImage;
