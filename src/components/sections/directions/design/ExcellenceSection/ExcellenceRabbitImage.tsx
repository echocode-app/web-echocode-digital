import Image from 'next/image';

const ExcellenceRabbitImage = () => {
  return (
    <div className="absolute -top-26 lg:-top-32 right-1/2 translate-x-35 sm:translate-x-40 md:translate-x-85 lg:translate-x-110">
      <div className="w-24 h-36 lg:w-31 lg:h-46">
        <Image src={'/images/rabbits/excellence.png'} alt="" fill />
      </div>
    </div>
  );
};

export default ExcellenceRabbitImage;
