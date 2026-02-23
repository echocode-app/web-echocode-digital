import { ReactNode } from 'react';

interface AnimationItemProps {
  children: ReactNode;
}

const AnimationItem = ({ children }: AnimationItemProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      <div className="bg-black w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full" />
      <p
        className="font-title font-bold text-[8px] leading-2 
       md:text-[16px] uppercase text-black md:leading-4.5"
      >
        {children}
      </p>
    </div>
  );
};

export default AnimationItem;
