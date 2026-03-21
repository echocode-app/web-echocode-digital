import Link from 'next/link';
import AdminUtmLinksGuide from '@/components/admin/info/AdminUtmLinksGuide';

export default function AdminInfoUtmPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-title text-title-2xl text-white">Info / UTM</h1>
          <p className="mt-1 max-w-220 font-main text-main-sm text-gray75">
            Ready-to-use tagged links for Echocode.digital and Echocode.app with consistent naming
            for attribution inside the admin dashboards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/info"
            className="
              inline-flex items-center
              rounded-(--radius-base)
              border border-gray16
              px-4 py-2
              font-title text-title-xs uppercase tracking-[0.12em]
              text-gray75
              transition duration-main
              hover:text-white
            "
          >
            Guide
          </Link>

          <span
            className="
              group relative inline-flex items-center
              overflow-hidden rounded-(--radius-base)
              border border-[#4b86ff]/60
              bg-[#4b86ff]/12
              px-4 py-2
              font-title text-title-xs uppercase tracking-[0.12em]
              text-white
            "
          >
            UTM
          </span>
        </div>
      </div>

      <AdminUtmLinksGuide />
    </section>
  );
}
