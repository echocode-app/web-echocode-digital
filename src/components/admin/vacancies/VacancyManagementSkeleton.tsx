const cardClassName = [
  'rounded-(--radius-base)',
  'border',
  'border-gray16',
  'bg-base-gray',
  'p-4',
].join(' ');

export default function VacancyManagementSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }, (_, index) => (
        <article key={`vacancy-settings-skeleton-${index}`} className={cardClassName}>
          <div className="h-5 w-40 animate-pulse rounded bg-gray16" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-gray16" />
          <div className="mt-6 h-10 w-full animate-pulse rounded bg-gray16" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray16" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-gray16" />
        </article>
      ))}
    </div>
  );
}
