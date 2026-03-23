import DashboardGrid from '@/components/admin/dashboard/DashboardGrid';

export default function AdminDashboardPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">.digital Dashboard</h1>
      <DashboardGrid />
    </section>
  );
}
