const statusBadgeBaseClassName = [
  'inline-flex',
  'items-center',
  'justify-center',
  'self-start',
  'rounded-full',
  'border',
  'px-3',
  'py-1.5',
  'font-title',
  'text-[11px]',
  'uppercase',
  'tracking-[0.14em]',
].join(' ');

export default function VacancyManagementStatusBadge({ isPublished }: { isPublished: boolean }) {
  const toneClassName = isPublished
    ? 'border-[#3ecf8e]/55 bg-[rgba(62,207,142,0.12)] text-[#8ef3bd]'
    : 'border-gray16 bg-black/20 text-gray75';

  return (
    <span className={`${statusBadgeBaseClassName} ${toneClassName}`}>
      {isPublished ? 'Published' : 'Hidden'}
    </span>
  );
}
