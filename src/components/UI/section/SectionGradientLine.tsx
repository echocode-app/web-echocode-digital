interface SectionGradientLineProps {
  height: string;
  fullWidth?: boolean;
}

const SectionGradientLine = ({ height, fullWidth = false }: SectionGradientLineProps) => {
  return (
    <div className={fullWidth ? 'mb-6' : 'md:px-8 mb-6'}>
      <div
        className={
          fullWidth
            ? 'bg-section-gradient-animated w-full'
            : 'bg-section-gradient-animated w-full max-w-250 mx-auto'
        }
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default SectionGradientLine;
