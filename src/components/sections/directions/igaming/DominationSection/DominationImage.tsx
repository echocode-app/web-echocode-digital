import Image from 'next/image';

interface DominationImage {
  image: string;
  desc: string;
  gradient?: boolean;
}

const DominationImage = ({ image, desc, gradient }: DominationImage) => {
  return (
    <div className="relative w-full md:w-120 aspect-480/254 font-title rounded-secondary">
      <span
        className=" font-wadik
    absolute top-0 left-1/2 -translate-1/2
    z-10 h-7 px-2 py-0.5
    flex items-center justify-center
    rounded-secondary
    bg-gray1 backdrop-blur-[30px]
    whitespace-nowrap"
      >
        <span
          className={` ${gradient ? 'bg-main-gradient' : 'bg-accent'}
    bg-clip-text text-transparent font-wadik`}
        >
          {desc}
        </span>
      </span>
      <Image src={image} alt={desc} sizes="480px" fill className="object-cover rounded-secondary" />
    </div>
  );
};

export default DominationImage;
