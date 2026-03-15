'use client';

import PartnerItem from './PartnerItem';
import { usePartnersCarousel } from './usePartnersCarousel';

type Partner = { image: string; desc: string; scale: string };

interface PartnerListProps {
  list: Partner[];
}

const PartnerList = ({ list }: PartnerListProps) => {
  const { containerRef, trackRef, items, trackStyle } = usePartnersCarousel(list);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <ul ref={trackRef} className="flex h-30 w-max items-center gap-0" style={trackStyle}>
        {items.map(({ key, dynamicScale, slotWidth, opacity, yOffset, ...item }) => (
          <PartnerItem
            key={key}
            {...item}
            dynamicScale={dynamicScale}
            slotWidth={slotWidth}
            opacity={opacity}
            yOffset={yOffset}
          />
        ))}
      </ul>
    </div>
  );
};

export default PartnerList;
