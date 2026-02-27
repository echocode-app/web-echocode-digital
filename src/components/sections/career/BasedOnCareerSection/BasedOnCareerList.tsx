import BasedOnCareerItem from './BasedOnCareerItem';

const BasedOnCareerList = () => {
  return (
    <ul className="flex justify-center flex-wrap gap-6">
      <BasedOnCareerItem
        title="Product Culture"
        desc="We care about stability, retention, and conversions just as much as clean code quality."
      />
      <BasedOnCareerItem
        title="No Micromanagement"
        desc="You get full ownership of features and direct access to product decision-making."
      />
      <BasedOnCareerItem
        title="Grow with us"
        desc="We grow people just like products: through mentorship, responsibility, and real impact."
      />
    </ul>
  );
};

export default BasedOnCareerList;
