import Image from 'next/image';

const StepsImage = () => {
  return (
    <div className="hidden lg:block relative w-86 h-96.5">
      <Image
        src={'/images/team/steps.png'}
        alt="Steps"
        fill
        sizes="344px"
        className="object-cover rounded-secondary"
      />
    </div>
  );
};

export default StepsImage;
