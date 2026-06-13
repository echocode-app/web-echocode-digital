import Image from 'next/image';

const EngineeringImage = () => {
  return (
    <div className="relative w-full md:w-152.5 aspect-610/558 rounded-secondary">
      <Image
        src={'/images/directions/web/engineering.png'}
        alt="Engineering"
        fill
        className="
  object-cover
  object-[100%_center]
  rounded-secondary
  mask-[linear-gradient(180deg,transparent_0%,black_18%,black_72%,transparent_100%),linear-gradient(90deg,black_0%,black_78%,transparent_100%),linear-gradient(270deg,black_0%,black_38%,transparent_100%)]
  mask-intersect
  [-webkit-mask-image:linear-gradient(180deg,transparent_0%,black_18%,black_72%,transparent_100%),linear-gradient(90deg,black_0%,black_78%,transparent_100%),linear-gradient(270deg,black_0%,black_38%,transparent_100%)]
  [-webkit-mask-composite:source-in]
"
      />
    </div>
  );
};

export default EngineeringImage;
