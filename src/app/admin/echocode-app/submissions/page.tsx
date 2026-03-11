import Link from 'next/link';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import EchocodeAppSubmissionsTable from '@/components/admin/echocode-app/EchocodeAppSubmissionsTable';

const BACK_TO_ANALYTICS_LINK_CLASS_NAME =
  'inline-flex items-center rounded-(--radius-base) ' +
  'border border-gray16 px-4 py-2 ' +
  'font-title text-title-xs uppercase tracking-[0.12em] text-gray75 ' +
  'transition duration-main hover:text-white';

export default function AdminEchocodeAppSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <h1 className="font-title text-title-2xl text-white">Echocode.app submissions</h1>
          <InfoTooltip
            label="Echocode.app submissions page info"
            text="Dedicated moderation page for project form submissions received from the external static app site."
          />
        </div>
        <Link href="/admin/echocode-app" className={BACK_TO_ANALYTICS_LINK_CLASS_NAME}>
          Back to analytics
        </Link>
      </div>
      <EchocodeAppSubmissionsTable />
    </section>
  );
}
