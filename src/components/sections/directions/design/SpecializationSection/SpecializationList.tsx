import SpecializationItem from './SpecializationItem';

const SpecializationList = () => {
  return (
    <ul className="flex flex-wrap  sm:justify-center gap-8">
      <SpecializationItem title="Mobile Apps" />
      <SpecializationItem title="iGaming" />
      <SpecializationItem title="Dashboards" />
      <SpecializationItem title="Subscription" />
    </ul>
  );
};

export default SpecializationList;
