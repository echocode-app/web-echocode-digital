import BusinessItem from './BusinessItem';

const BusinessList = () => {
  return (
    <ul className="flex gap-8 flex-wrap justify-start sm:justify-center">
      <li className="max-w-56.5 w-full ">
        <BusinessItem title="Checkout ＆ Payments" />
      </li>
      <li className="max-w-56.5 w-full ">
        <BusinessItem title="User Onboarding" />
      </li>
      <li className="max-w-56.5 w-full ">
        <BusinessItem title="Data Integrity" />
      </li>
      <li className="max-w-56.5 w-full ">
        <BusinessItem title="Edge Case Guarding" />
      </li>
    </ul>
  );
};

export default BusinessList;
