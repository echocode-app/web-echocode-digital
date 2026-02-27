import TransparencyItem from './TransparencyItem';

const TransparencyList = () => {
  return (
    <ul className="flex gap-8 flex-wrap justify-start">
      <li className="max-w-56.5 w-full ">
        <TransparencyItem title="Real sprint progress" />
      </li>
      <li className="max-w-56.5 w-full ">
        <TransparencyItem title="Real product metrics" />
      </li>
      <li className="max-w-56.5 w-full ">
        <TransparencyItem title="Real QA reports" />
      </li>
      <li className="max-w-56.5 w-full ">
        <TransparencyItem title="Real release readiness" />
      </li>
    </ul>
  );
};

export default TransparencyList;
