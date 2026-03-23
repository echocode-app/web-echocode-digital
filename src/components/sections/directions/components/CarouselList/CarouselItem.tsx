import Image from 'next/image';

interface CarouselItemProps {
  image: string;
  desc: string;
  scale?: string;
  position?: string;
}

const CarouselItem = ({ image, desc, scale, position = '50% 50%' }: CarouselItemProps) => {
  return (
    <li
      className="w-34.5 px-6.5 py-3 mr-3 bg-accent rounded-secondary hover:bg-transparent duration-main 
      border-accent border hover:border-accent"
    >
      <div className="relative w-22 h-full">
        <Image
          src={image}
          fill
          alt={desc}
          className="object-contain"
          style={{ scale: scale, objectPosition: position }}
        />
      </div>
    </li>
  );
};

export default CarouselItem;
