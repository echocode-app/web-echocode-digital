import StepsItem from './StepsItem';

const StepsList = () => {
  return (
    <ul className="flex flex-col gap-6 max-w-153.5">
      <StepsItem title="stepsList.step01.title" />
      <StepsItem title="stepsList.step02.title" />
      <StepsItem title="stepsList.step03.title" />
      <StepsItem title="stepsList.step04.title" />
    </ul>
  );
};

export default StepsList;
