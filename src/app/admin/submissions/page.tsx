import Link from 'next/link';
import SubmissionsOverviewGrid from '@/components/admin/submissions/SubmissionsOverviewGrid';

export default function AdminSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-title text-title-2xl text-white">Submissions metrics</h1>
          <p className="mt-1 font-main text-main-sm text-gray75">
            Metrics for the client contact modal flow, without the separate email-only submissions
            queue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/submissions/clients"
            className="group relative inline-flex items-center 
            overflow-hidden rounded-(--radius-base) 
            border border-[#ffd38e]
            bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] 
            px-4 py-2 mx-1 
            font-title text-title-xs uppercase tracking-[0.12em]
            text-black transition duration-main 
            hover:border-[#ffc978] hover:shadow-[0_0_0_1px_#ffd38e,0_10px_30px_rgba(255,211,142,0.25)]"
            aria-label="Open client submissions moderation list"
            title="Open client submissions moderation list"
          >
            <span
              className="pointer-events-none absolute inset-0
            rounded-(--radius-base) border border-[#ffc978]/70 
            opacity-70 transition duration-main group-hover:opacity-100"
            />
            <span className="relative">Clients</span>
          </Link>
          <Link
            href="/admin/submissions/emails"
            className="inline-flex items-center 
            rounded-(--radius-base) 
            border border-[#4b86ff]/40 
            bg-[#4b86ff]/10 
            px-4 py-2 
            font-title text-title-xs uppercase tracking-[0.12em] 
            text-[#b8cdff] 
            transition duration-main 
            hover:border-[#4b86ff]/70 hover:text-white"
            aria-label="Open email submissions moderation list"
            title="Open email submissions moderation list"
          >
            Emails
          </Link>
        </div>
      </div>
      <SubmissionsOverviewGrid />
    </section>
  );
}
