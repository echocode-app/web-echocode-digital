interface AnimationListProps {
  title: string;
}

const AnimationList = ({ title }: AnimationListProps) => {
  return (
    <ul className="flex items-center shrink-0 font-title text-title-xs text-black">
      <li className="flex items-center shrink-0">
        <p className="whitespace-nowrap uppercase">{title}</p>
        <div className="block w-2 h-2 mx-4 bg-black rounded-full" />
      </li>
      <li className="flex items-center shrink-0">
        <p className="whitespace-nowrap uppercase">{title}</p>
        <div className="block w-2 h-2 mx-4 bg-black rounded-full" />
      </li>
    </ul>
  );
};

export default AnimationList;
