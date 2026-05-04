import { buildBreadcrumbSchema, type BreadcrumbItem } from '@/lib/seo/metadata';

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
  locale: string;
};

export default function BreadcrumbJsonLd({ items, locale }: BreadcrumbJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(items, locale)) }}
    />
  );
}
