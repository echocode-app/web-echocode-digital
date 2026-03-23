const META_LABEL_CLASS_NAME = 'font-main text-main-xs uppercase tracking-[0.14em] text-gray60';
const META_VALUE_CLASS_NAME = 'font-main text-main-sm text-white';

type PortfolioCardMetaItemProps = {
  label: string;
  value: string;
  breakAll?: boolean;
};

export default function PortfolioCardMetaItem({
  label,
  value,
  breakAll = false,
}: PortfolioCardMetaItemProps) {
  return (
    <div className="space-y-2">
      <p className={META_LABEL_CLASS_NAME}>{label}</p>
      <p className={`${META_VALUE_CLASS_NAME}${breakAll ? ' break-all' : ''}`}>{value}</p>
    </div>
  );
}
