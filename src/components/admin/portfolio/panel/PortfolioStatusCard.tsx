type PortfolioStatusCardProps = {
  className: string;
  message: string;
  tone?: 'default' | 'error';
};

export default function PortfolioStatusCard({
  className,
  message,
  tone = 'default',
}: PortfolioStatusCardProps) {
  return (
    <article className={className}>
      <p
        className={
          tone === 'error'
            ? 'font-main text-main-sm text-[#ff9ca6]'
            : 'font-main text-main-sm text-gray75'
        }
      >
        {message}
      </p>
    </article>
  );
}
