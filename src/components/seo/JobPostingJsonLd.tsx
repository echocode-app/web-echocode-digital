import { seoBaseUrl } from '@/lib/seo/metadata';

type JobPostingJsonLdProps = {
  vacancyTitle: string;
  vacancySlug: string;
  level: string | null;
  conditions: string[];
  employmentType: string;
  datePosted: string | null;
};

const VALID_THROUGH_DAYS = 90;

function formatIsoDate(value: Date): string {
  return value.toISOString().split('T')[0] ?? value.toISOString();
}

function resolveDatePosted(datePosted: string | null): string {
  if (datePosted) {
    return datePosted;
  }
  return formatIsoDate(new Date());
}

function resolveValidThrough(datePostedIso: string): string {
  const base = new Date(datePostedIso);
  const reference = Number.isNaN(base.getTime()) ? new Date() : base;
  const validThrough = new Date(reference);
  validThrough.setUTCDate(validThrough.getUTCDate() + VALID_THROUGH_DAYS);
  return formatIsoDate(validThrough);
}

function mapEmploymentType(employmentType: string): string {
  const normalized = employmentType.toLowerCase();
  if (normalized.includes('part')) return 'PART_TIME';
  if (normalized.includes('contract')) return 'CONTRACTOR';
  if (normalized.includes('intern')) return 'INTERN';
  if (normalized.includes('temp')) return 'TEMPORARY';
  return 'FULL_TIME';
}

function buildDescription(input: JobPostingJsonLdProps): string {
  const titleWithLevel = input.level
    ? `${input.vacancyTitle} (${input.level})`
    : input.vacancyTitle;
  const conditions = input.conditions.length > 0 ? input.conditions.join(', ') : 'Remote';

  return [
    `<p>Join Echocode as a ${titleWithLevel} working remotely. Echocode is a software development studio building iOS, Android, web and iGaming products with a product-focused engineering team.</p>`,
    `<p><strong>Conditions:</strong> ${conditions}.</p>`,
    `<p><strong>Employment type:</strong> ${input.employmentType}. <strong>Location:</strong> Remote.</p>`,
  ].join('');
}

export default function JobPostingJsonLd(props: JobPostingJsonLdProps) {
  const datePostedIso = resolveDatePosted(props.datePosted);
  const validThroughIso = resolveValidThrough(datePostedIso);
  const titleWithLevel = props.level ? `${props.vacancyTitle} (${props.level})` : props.vacancyTitle;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: titleWithLevel,
    description: buildDescription(props),
    datePosted: datePostedIso,
    validThrough: validThroughIso,
    employmentType: mapEmploymentType(props.employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Echocode',
      sameAs: seoBaseUrl,
      logo: `${seoBaseUrl}/favicon/fulllogo.png`,
    },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    url: `${seoBaseUrl}/career/${props.vacancySlug}`,
    directApply: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
