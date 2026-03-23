import Image from 'next/image';

const EngineeringImage = () => {
  return (
    <div className="relative w-full md:w-156.5 h-69 rounded-secondary">
      <Image
        src={'/images/directions/web/engineering.jpg'}
        alt="Engineering"
        fill
        className="object-cover rounded-secondary  mask-[linear-gradient(0deg,transparent_4%,black_20%)]"
      />
    </div>
  );
};

export default EngineeringImage;
