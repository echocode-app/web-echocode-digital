import Image from 'next/image';

interface ModerationImageProps {
  image: string;
  title: string;
  size: { w: string; h: string };
}

const ModerationImage = ({ image, title, size: { w, h } }: ModerationImageProps) => {
  return (
    <div className="min-w-14 min-h-14 flex justify-center items-center rounded-full bg-accent">
      <div className={`relative`} style={{ width: `${w}px`, height: `${h}px` }}>
        <Image src={image} alt={title} fill className="" />
      </div>
    </div>
  );
};

export default ModerationImage;
