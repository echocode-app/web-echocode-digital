'use client';

import Image from 'next/image';

interface PartnerItemProps {
  image: string;
  desc: string;
  scale: string;
  dynamicScale?: number;
  slotWidth?: number;
  opacity?: number;
  yOffset?: number;
}

const PartnerItem = ({
  image,
  desc,
  scale,
  dynamicScale = 1,
  slotWidth = 132,
  opacity = 1,
  yOffset = 0,
}: PartnerItemProps) => {
  return (
    <li
      className="flex h-20 shrink-0 items-center justify-center"
      style={{ width: `${slotWidth}px` }}
    >
      <div
        className="flex h-20 w-33 items-center justify-center rounded-secondary 
        bg-gray7/90 backdrop-blur-[6px] 
        transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `translateY(${yOffset}px) scale(${dynamicScale})`,
          opacity,
          zIndex: Math.round(dynamicScale * 100),
        }}
      >
        <div className="relative h-6 w-30">
          <Image
            src={image}
            alt={desc}
            fill
            className="object-contain"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </li>
  );
};

export default PartnerItem;
