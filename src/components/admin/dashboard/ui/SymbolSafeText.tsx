import type { ReactNode } from 'react';

type SymbolSafeTextProps = {
  text: string;
  className?: string;
};

function renderWithFallbackSymbols(value: string): ReactNode[] {
  return Array.from(value).map((char, index) => {
    const isSymbol = !/[A-Za-z0-9]/.test(char);
    if (!isSymbol) {
      return <span key={`${char}-${index}`}>{char}</span>;
    }

    return (
      <span key={`${char}-${index}`} className="font-extra">
        {char}
      </span>
    );
  });
}

export default function SymbolSafeText({ text, className }: SymbolSafeTextProps) {
  return <span className={className}>{renderWithFallbackSymbols(text)}</span>;
}
