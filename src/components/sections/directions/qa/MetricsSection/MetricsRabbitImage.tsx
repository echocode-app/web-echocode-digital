import Image from 'next/image';

const MetricsRabbitImage = () => {
  return (
    <div className="hidden sm:block absolute right-[calc(50%-158px)] -top-7.5 md:-top-8.5 md:-right-4">
      <div className="relative w-40 h-29 md:w-57.5 md:h-33.5">
        <Image
          src={'/images/rabbits/qa.png'}
          alt="QA Rabbit"
          fill
          className="object-cover -scale-x-100"
        />
      </div>
    </div>
  );
};

export default MetricsRabbitImage;
