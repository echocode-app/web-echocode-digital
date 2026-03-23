interface InvertedSectionGradientLineProps {
  className?: string;
}

const InvertedSectionGradientLine = ({
  className = 'w-70 sm:w-[320px]',
}: InvertedSectionGradientLineProps) => {
  return (
    <div className="mb-10">
      <div
        className={`
          ${className}
          h-px
          bg-invert-main-gradient
          shadow-[6px_0_12px_-4px_rgba(0,0,0,0.75)]
          mask-[linear-gradient(to_right,black_0%,black_80%,transparent_100%)]
        `}
      />
    </div>
  );
};

export default InvertedSectionGradientLine;
