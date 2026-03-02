import Image from 'next/image';

const SolutionsImage = () => {
  return (
    <div className="hidden lg:block relative w-86 h-130 overflow-hidden rounded-secondary">
      <Image
        src={'/images/directions/igaming/igaming.png'}
        alt="IGaming"
        fill
        sizes="344px"
        className="object-contain rounded-secondary"
        style={{ objectPosition: '50% 0%' }}
      />
    </div>
  );
};

export default SolutionsImage;
