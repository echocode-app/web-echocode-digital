import { ReactNode } from 'react';

interface ModerationItemProps {
  children: ReactNode;
  title: string;
  desc: string;
}

const ModerationItem = ({ children, title, desc }: ModerationItemProps) => {
  return (
    <li className="flex items-center gap-4 max-w-103 py-2">
      {children}
      <div>
        <h3 className="font-title text-title-sm mb-1 uppercase">{title}</h3>
        <p className="text-main-sm text-[#90A1B9]">{desc}</p>
      </div>
    </li>
  );
};

export default ModerationItem;
