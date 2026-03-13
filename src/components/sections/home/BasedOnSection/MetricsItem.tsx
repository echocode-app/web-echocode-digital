import { ReactNode } from 'react';

interface MetricsItemProps {
  children: ReactNode;
}

const MetricsItem = ({ children }: MetricsItemProps) => {
  return (
    <li
      className="px-3 border-l flex flex-col justify-between h-22 border-accent w-full max-w-95
     lg:max-w-56.5 text-primary-gray text-main-sm"
    >
      {children}
    </li>
  );
};

export default MetricsItem;
