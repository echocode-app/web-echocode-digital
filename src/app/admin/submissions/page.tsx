import Link from 'next/link';
import SubmissionsOverviewGrid from '@/components/admin/submissions/SubmissionsOverviewGrid';

export default function AdminSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-title text-title-2xl text-white">Submissions metrics</h1>
        <Link
          href="/admin/submissions/clients"
          className="group relative inline-flex items-center overflow-hidden rounded-(--radius-base) border border-[#ffd38e]
          bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] px-4 py-2 mx-1 font-title text-title-xs uppercase tracking-[0.12em]
          text-black transition duration-main hover:border-[#ffc978] hover:shadow-[0_0_0_1px_#ffd38e,0_10px_30px_rgba(255,211,142,0.25)]"
          aria-label="Open submissions moderation list"
          title="Open submissions moderation list"
        >
          <span className="pointer-events-none absolute inset-0
          rounded-(--radius-base) border border-[#ffc978]/70 
          opacity-70 transition duration-main group-hover:opacity-100" />
          <span className="relative">View submissions</span>
        </Link>
      </div>
      <SubmissionsOverviewGrid />
    </section>
  );
}
