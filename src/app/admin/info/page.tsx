import SkeletonCard from '@/components/admin/SkeletonCard';

export default function AdminInfoPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-title-2xl text-white">Info</h1>
      <SkeletonCard
        title="Admin information hub"
        hint="Documentation and support links will appear here."
      />
    </section>
  );
}
