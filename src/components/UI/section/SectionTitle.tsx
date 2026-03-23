import { ReactNode } from 'react';

interface SectionTitleProps {
  marginBottom?: string;
  children: ReactNode;
}

const SectionTitle = ({ children, marginBottom = '0' }: SectionTitleProps) => {
  return (
    <h2
      style={{ marginBottom }}
      className="block text-title-2xl md:text-title-4xl font-title uppercase"
    >
      {children}
    </h2>
  );
};

export default SectionTitle;
