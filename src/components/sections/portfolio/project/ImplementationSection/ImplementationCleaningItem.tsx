interface ImplementationCleaningItemProps {
  desc: string;
}

const ImplementationCleaningItem = ({ desc }: ImplementationCleaningItemProps) => {
  return (
    <li className="flex gap-3 items-center">
      <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full" />
      <p className="text-[#E3E4E6]">{desc}</p>
    </li>
  );
};

export default ImplementationCleaningItem;
