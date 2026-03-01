type SkeletonCardProps = {
  title: string;
  hint: string;
};

export default function SkeletonCard({ title, hint }: SkeletonCardProps) {
  return (
    <article className="rounded-(--radius-base) border border-gray16 bg-gray7 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h2 className="font-title text-title-base text-white">{title}</h2>
      <p className="mt-2 font-main text-main-sm text-gray75">{hint}</p>
    </article>
  );
}
