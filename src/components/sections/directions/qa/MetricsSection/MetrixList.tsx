import MetricsItem from './MetricsItem';

const metrics = [
  {
    title: 'Less Churn',
    desc: "Users stay with you because of the product's flawless reliability.",
  },
  {
    title: 'Fewer Refunds',
    desc: 'Minimal complaints regarding the behavior of paid features.',
  },
  {
    title: 'Better Ratings',
    desc: 'High 4.8+ ratings driven by smooth and crash-free app performance.',
  },
  {
    title: 'Monetization',
    desc: 'Transactions process without failure during critical high-traffic windows.',
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
