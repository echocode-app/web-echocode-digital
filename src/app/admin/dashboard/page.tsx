import DashboardGrid from '@/components/admin/dashboard/DashboardGrid';
import NewClientSubmissionsAlert from '@/components/admin/dashboard/NewClientSubmissionsAlert';

export default function AdminDashboardPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Dashboard</h1>
      <NewClientSubmissionsAlert />
      <DashboardGrid />
    </section>
  );
}
