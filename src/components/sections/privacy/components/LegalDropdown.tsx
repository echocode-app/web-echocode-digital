'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';

interface LegalDropdownProps {
  title: string;
  children: ReactNode;
}

const LegalDropdown = ({ title, children }: LegalDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      onClick={() => setIsOpen(!isOpen)}
      className="p-3 border border-main-border rounded-secondary cursor-pointer
       hover:border-accent focus:border-accent duration-main"
    >
      <div className="flex justify-between">
        <h3 className="font-title">{title}</h3>
        <div className="flex justify-center items-center">
          <Image
            src="/UI/dropdown-icon.svg"
            alt="Dropdown Icon"
            width={16}
            height={16}
            className={`transition-transform duration-500 ease-in-out min-w-4 min-h-4 ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </div>
      </div>
      <div
        className={`grid duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`text-primary-base text-gray75 duration-500 ease-in-out ${
              isOpen ? 'translate-y-0' : '-translate-y-2'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </li>
  );
};

export default LegalDropdown;
