import SkeletonCard from '@/components/admin/SkeletonCard';

export default function AdminLogsPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-title-2xl text-white">Logs</h1>
      <SkeletonCard title="Admin audit logs" hint="Server endpoint is ready." />
    </section>
  );
}
