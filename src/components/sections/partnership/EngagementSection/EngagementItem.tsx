interface EngagementItemProps {
  title: string;
  desc: string;
  priority: string;
}

const EngagementItem = ({ title, desc, priority }: EngagementItemProps) => {
  return (
    <li
      className="group relative flex flex-col gap-3 p-5 max-w-120  rounded-secondary
       overflow-hidden duration-main"
    >
      <div className="absolute inset-0 bg-main-border transition-opacity duration-main" />
      <div className="absolute inset-0 bg-main-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-main" />
      <div className="absolute inset-0.5 bg-black rounded-[calc(var(--radius-secondary)-2px)] z-0" />
      <h3 className="font-title text-[20px] z-10 pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 z-10 pointer-events-none">{desc}</p>
      <div className="h-px w-full bg-accent z-10" />
      <dl className="z-10">
        <dt className="mb-3 font-title text-title-xs text-accent z-10 pointer-events-none">
          PRIORITY:
        </dt>
        <dd className="text-main-sm italic uppercase font-semibold z-10 pointer-events-none">
          {priority}
        </dd>
      </dl>
    </li>
  );
};

export default EngagementItem;
