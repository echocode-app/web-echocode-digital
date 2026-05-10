import { AppLocale, buildBreadcrumbSchema, type BreadcrumbItem } from '@/lib/seo/metadata';

type BreadcrumbJsonLdProps = {
  locale: AppLocale;
  items: BreadcrumbItem[];
};

export default function BreadcrumbJsonLd({ locale, items }: BreadcrumbJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(locale, items)) }}
    />
  );
}
