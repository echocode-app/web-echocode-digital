import { buildBreadcrumbSchema, type BreadcrumbItem } from '@/lib/seo/metadata';

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(items)) }}
    />
  );
}
