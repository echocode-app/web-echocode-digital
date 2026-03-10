import SolutionItem from '../../components/SolutionItem';

import gameSolutions from '@/data/directions/game-solutions.json';

const SolutionList = () => {
  return (
    <ul className="max-w-153.5 flex flex-col gap-6">
      {gameSolutions.map((items, i) => (
        <SolutionItem key={i} {...items} translateKey="GamePage.SolutionsSection.solutionsList" />
      ))}
    </ul>
  );
};

export default SolutionList;
