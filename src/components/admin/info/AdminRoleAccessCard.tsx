type AdminRoleAccessCardProps = {
  role: string;
  badge: string;
  tone: string;
  points: readonly string[];
};

export default function AdminRoleAccessCard({
  role,
  badge,
  tone,
  points,
}: AdminRoleAccessCardProps) {
  return (
    <article className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-title text-title-xs text-white">{role}</h3>
        <span
          className={`
            rounded-full border px-2 py-0.5
            font-main text-[10px] uppercase tracking-[0.12em]
            ${tone}
          `}
        >
          {badge}
        </span>
      </div>

      <div className="mt-3 grid gap-2 font-main text-main-xs text-gray75">
        {points.map((point) => (
          <p key={point}>{point}</p>
        ))}
      </div>
    </article>
  );
}
