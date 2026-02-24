import PhilosophyItem from './PhilosophyItem';

const PhilosophyList = () => {
  return (
    <ul className="flex justify-center flex-wrap gap-6">
      <PhilosophyItem
        title="Trust"
        desc="We build visual authority that removes barriers before payment. Your brand looks premium, reliable from first second."
      />
      <PhilosophyItem
        title="Clarity"
        desc="Intuitive interfaces that require no instructions. We reduce cognitive load so users can focus on  goals and your value"
      />
      <PhilosophyItem
        title="Monetization"
        desc="Leveraging behavioral psychology to increase LTV and average order value through calculated interaction patterns"
      />
    </ul>
  );
};

export default PhilosophyList;
