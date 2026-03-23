import ServiceItem from './CarouselItem';

interface CarouselListProps {
  list: { image: string; desc: string }[];
}

const CarouselList = ({ list }: CarouselListProps) => {
  const doubled = [...list, ...list];

  return (
    <div className="overflow-hidden group mask-[linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]">
      <ul
        className="flex w-max h-12.5
          animate-[marquee-reverse_30s_linear_infinite]
         group-hover:[animation-play-state:paused]"
      >
        {doubled.map((items, i) => (
          <ServiceItem key={i} {...items} />
        ))}
      </ul>
    </div>
  );
};

export default CarouselList;
