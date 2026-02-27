import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <h2 className="block text-title-2xl md:text-title-4xl font-title text-white uppercase">
      {children}
    </h2>
  );
};

export default SectionTitle;
