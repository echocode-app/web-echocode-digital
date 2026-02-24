import WorkItem from './WorkItem';

const WorkList = () => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      <WorkItem
        title="Dedicated"
        desc="Each team is fully committed to your project. No context shifts, no distractions."
      />
      <WorkItem
        title="Responsible"
        desc="We take full responsibility for the outcome, not just completing tickets."
      />
      <WorkItem
        title="Optimized"
        desc="Balancing speed, stability, and revenue to ensure business growth."
      />
    </ul>
  );
};

export default WorkList;
