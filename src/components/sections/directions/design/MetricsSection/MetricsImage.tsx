import Image from 'next/image';

const MetricsImage = () => {
  return (
    <div className="relative w-full aspect-4/5 sm:w-90 md:w-98.5 h-106.5 lg:order-0">
      <Image
        src={'/images/directions/design/metrics.png'}
        alt="Metrics"
        fill
        className="object-cover rounded-secondary"
      />
    </div>
  );
};

export default MetricsImage;
