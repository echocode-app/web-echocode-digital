import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import PortfolioManagementPanel from '@/components/admin/portfolio/PortfolioManagementPanel';

export default function AdminPortfolioPage() {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-title text-title-2xl text-white">.digital Portfolio</h1>
        </div>
        <InfoTooltip
          label="Portfolio admin page info"
          text="This page manages only dynamic preview cards for the portfolio section. Static cards and public frontend integration are handled separately."
        />
      </div>
      <PortfolioManagementPanel />
    </section>
  );
}
