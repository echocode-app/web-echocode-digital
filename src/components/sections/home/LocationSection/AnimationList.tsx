interface AnimationListProps {
  title: string;
  fixInvertedExclamation?: boolean;
}

const AnimationTitle = ({
  title,
  fixInvertedExclamation,
}: {
  title: string;
  fixInvertedExclamation?: boolean;
}) => {
  if (!fixInvertedExclamation || !title.startsWith('¡')) {
    return <>{title}</>;
  }

  return (
    <>
      <span className="inline-block rotate-180 font-title leading-none">!</span>
      <span>{title.slice(1)}</span>
    </>
  );
};

const AnimationList = ({ title, fixInvertedExclamation = false }: AnimationListProps) => {
  return (
    <ul className="flex items-center shrink-0 font-title text-title-xs text-black">
      <li className="flex items-center shrink-0">
        <p className="whitespace-nowrap uppercase leading-8">
          <AnimationTitle title={title} fixInvertedExclamation={fixInvertedExclamation} />
        </p>
        <div className="block w-2 h-2 mx-4 bg-black rounded-full" />
      </li>

      <li className="flex items-center shrink-0">
        <p className="whitespace-nowrap uppercase leading-8">
          <AnimationTitle title={title} fixInvertedExclamation={fixInvertedExclamation} />
        </p>
        <div className="block w-2 h-2 mx-4 bg-black rounded-full" />
      </li>
    </ul>
  );
};

export default AnimationList;
