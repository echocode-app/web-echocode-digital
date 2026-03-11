import Link from 'next/link';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import EchocodeAppOverview from '@/components/admin/echocode-app/EchocodeAppOverview';
import NewEchocodeAppSubmissionsAlert from '@/components/admin/echocode-app/NewEchocodeAppSubmissionsAlert';

const OPEN_SUBMISSIONS_LINK_CLASS_NAME =
  'inline-flex items-center rounded-(--radius-base) ' +
  'border border-accent/60 bg-accent/10 px-4 py-2 ' +
  'font-title text-title-xs uppercase tracking-[0.12em] text-white ' +
  'transition duration-main hover:border-accent hover:bg-accent/15';

export default function AdminEchocodeAppPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <h1 className="font-title text-title-2xl text-white">Echocode.app</h1>
          <InfoTooltip
            label="Echocode.app admin slice info"
            text="Separate admin slice for the external static site integration, including isolated analytics and submissions."
          />
        </div>
        <Link href="/admin/echocode-app/submissions" className={OPEN_SUBMISSIONS_LINK_CLASS_NAME}>
          Open submissions
        </Link>
      </div>
      <NewEchocodeAppSubmissionsAlert />
      <EchocodeAppOverview />
    </section>
  );
}
