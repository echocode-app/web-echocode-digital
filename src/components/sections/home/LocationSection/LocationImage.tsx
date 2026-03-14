import Image from 'next/image';
import AnimationList from './AnimationList';
interface LocationImageProps {
  image: string;
  title: string;
  gradient: string;
}

const LocationImage = ({ image, title, gradient }: LocationImageProps) => {
  return (
    <div className="relative w-full sm:max-w-76.5 aspect-306/200 max-h-50 mb-4 overflow-hidden">
      <div
        className={`absolute top-0 right-0 rotate-90 translate-y-20 translate-x-21 
  flex items-center w-51 h-9.25 z-1 overflow-hidden
 ${gradient}`}
      >
        <div className="flex aspect-306/200 animate-[marquee-reverse_8s_linear_infinite] will-change-transform">
          <AnimationList title={title} />
          <AnimationList title={title} />
        </div>
      </div>
      <Image
        src={image}
        alt={title}
        fill
        sizes="306px"
        className="object-cover rounded-l-secondary w-full"
      />
    </div>
  );
};

export default LocationImage;
