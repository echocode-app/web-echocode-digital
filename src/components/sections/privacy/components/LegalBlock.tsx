import { ReactNode } from 'react';

interface LegalBlockProps {
  children: ReactNode;
}

const LegalBlock = ({ children }: LegalBlockProps) => {
  return (
    <div className="p-3 mb-7 border border-main-border rounded-secondary">
      <p className="text-primary-base text-gray75">{children}</p>
    </div>
  );
};

export default LegalBlock;
