import Image from 'next/image';

const ExcellenceImage = () => {
  return (
    <div className="hidden lg:block relative w-98.5 h-144">
      <Image
        src={'/images/directions/design/excellence.png'}
        alt="Excellence"
        fill
        sizes="394px"
        className="object-cover rounded-secondary"
      />
    </div>
  );
};

export default ExcellenceImage;
