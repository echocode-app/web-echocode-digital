import ImplementationCleaningItem from './ImplementationCleaningItem';

const list = [
  'Building the backend and database',
  'Designing native iOS interfaces tailored for both user roles',
  'Integrating Stripe for secure payments',
  'Implementing a two-way messaging system',
];

const ImplementationCleaningList = () => {
  return (
    <ul className="flex flex-col gap-4 max-w-130">
      {list.map((desc, i) => (
        <ImplementationCleaningItem key={i} desc={desc} />
      ))}
      <li className="flex gap-3 items-start">
        <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full mt-2.5" />
        <p className="text-[#E3E4E6]">
          Developing an admin panel for comprehensive user and service management
        </p>
      </li>
      <li className="flex gap-3 items-start">
        <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full mt-2.5" />
        <p className="text-[#E3E4E6]">
          Thorough testing across multiple iPhone models and iOS versions to ensure performance and
          compatibility
        </p>
      </li>
    </ul>
  );
};

export default ImplementationCleaningList;
