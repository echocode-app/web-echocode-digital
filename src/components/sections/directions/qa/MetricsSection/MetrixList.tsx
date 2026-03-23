import MetricsItem from './MetricsItem';

const metrics = [
  {
    title: 'met01.title',
    desc: 'met01.desc',
  },
  {
    title: 'met02.title',
    desc: 'met02.desc',
  },
  {
    title: 'met03.title',
    desc: 'met03.desc',
  },
  {
    title: 'met04.title',
    desc: 'met04.desc',
  },
];

const MetricsList = () => {
  return (
    <ul className="flex gap-6 flex-wrap justify-center max-w-120">
      {metrics.map((item, i) => (
        <MetricsItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default MetricsList;
