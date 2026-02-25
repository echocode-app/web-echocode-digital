import StepsItem from './StepsItem';

const StepsList = () => {
  return (
    <ul className="flex flex-col gap-6 max-w-153.5">
      <StepsItem title="Launched apps with millions of users" />
      <StepsItem title="Survived App Store rejections and complex compliance" />
      <StepsItem title="Scaled systems under real-world massive traffic" />
      <StepsItem title="Built and maintained high-monetization products" />
    </ul>
  );
};

export default StepsList;
