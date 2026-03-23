import Link from 'next/link';
import AdminInfoOverview from '@/components/admin/info/AdminInfoOverview';

export default function AdminInfoPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-title text-title-2xl text-white">Info</h1>
          <p className="mt-1 max-w-220 font-main text-main-sm text-gray75">
            Internal guide for the admin panel: what each section does, how main counts are formed
            and which roles have full or partial access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="
              group relative inline-flex items-center
              overflow-hidden rounded-(--radius-base)
              border border-[#ffd38e]
              bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)]
              px-4 py-2 mx-1
              font-title text-title-xs uppercase tracking-[0.12em]
              text-black
            "
          >
            <span
              className="
                pointer-events-none absolute inset-0
                rounded-(--radius-base) border border-[#ffc978]/70
                opacity-70
              "
            />
            <span className="relative">Guide</span>
          </span>

          <Link
            href="/admin/info/utm"
            className="
              inline-flex items-center
              rounded-(--radius-base)
              border border-[#4b86ff]/40
              bg-[#4b86ff]/10
              px-4 py-2
              font-title text-title-xs uppercase tracking-[0.12em]
              text-[#b8cdff]
              transition duration-main
              hover:border-[#4b86ff]/70 hover:text-white
            "
          >
            UTM
          </Link>
        </div>
      </div>

      <AdminInfoOverview />
    </section>
  );
}
