const META_LABEL_CLASS_NAME = 'font-main text-main-xs uppercase tracking-[0.14em] text-gray60';
const META_VALUE_CLASS_NAME = 'font-main text-main-sm text-white';
const LINK_CLASS_NAME =
  'font-main text-main-sm text-[#ffd38e] underline underline-offset-4 break-all';

export default function PortfolioCardImageMetaItem({ image }: { image: string }) {
  return (
    <div className="space-y-2">
      <p className={META_LABEL_CLASS_NAME}>Image</p>
      <div className="space-y-1">
        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS_NAME}
          title="Open image preview in a new tab"
        >
          Open image preview
        </a>
        <p className={`${META_VALUE_CLASS_NAME} break-all`}>{image}</p>
      </div>
    </div>
  );
}
