import WorkItem from './WorkItem';

const WorkList = () => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      <WorkItem title="work01.title" desc="work01.description" />
      <WorkItem title="work02.title" desc="work02.description" />
      <WorkItem title="work03.title" desc="work03.description" />
    </ul>
  );
};

export default WorkList;
