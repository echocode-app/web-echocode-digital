import SkeletonCard from '@/components/admin/SkeletonCard';

export default function AdminPortfolioPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-title-2xl text-white">Portfolio</h1>
      <SkeletonCard title="Portfolio manager" hint="Server endpoint is ready." />
    </section>
  );
}
