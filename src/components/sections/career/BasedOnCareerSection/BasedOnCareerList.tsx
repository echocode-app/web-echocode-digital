import BasedOnCareerItem from './BasedOnCareerItem';

const BasedOnCareerList = () => {
  return (
    <ul className="flex justify-center flex-wrap gap-6">
      <BasedOnCareerItem title="bus01.title" desc="bus01.description" />
      <BasedOnCareerItem title="bus02.title" desc="bus02.description" />
      <BasedOnCareerItem title="bus03.title" desc="bus03.description" />
    </ul>
  );
};

export default BasedOnCareerList;
