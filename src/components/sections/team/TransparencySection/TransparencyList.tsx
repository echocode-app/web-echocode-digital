import TransparencyItem from './TransparencyItem';

const TransparencyList = () => {
  return (
    <ul className="flex gap-8 flex-wrap justify-start">
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans01.title" />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans02.title" />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans03.title" />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans04.title" />
      </li>
    </ul>
  );
};

export default TransparencyList;
