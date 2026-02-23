import Image from 'next/image';

const UniversesImage = () => {
  return (
    <div className="relative w-full sm:w-86.5 h-90 rounded-secondary order-0 lg:order-1">
      <Image
        src={'/images/directions/game/universes.jpg'}
        alt="Universes"
        fill
        className="object-cover rounded-secondary"
      />
    </div>
  );
};

export default UniversesImage;
