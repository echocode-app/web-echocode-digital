export const ADMIN_INFO_SECTION_CARD_CLASS_NAME =
  'rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main';

export const ADMIN_ROLE_ACCESS = [
  {
    role: 'Admin',
    badge: 'Full',
    tone: 'border-accent/40 bg-accent/6 text-accent',
    points: [
      'Full access to settings, moderation, content updates and internal analytics.',
      'Can manage admin access, review logs, update submissions, vacancies and portfolio.',
    ],
  },
  {
    role: 'Manager',
    badge: 'Partial',
    tone: 'border-[#ffd38e]/45 bg-[#ffd38e]/8 text-[#ffd38e]',
    points: [
      'Operational access to submissions, vacancies, portfolio and dashboards.',
      'No access to admin settings or internal logs.',
    ],
  },
  {
    role: 'Developer',
    badge: 'Read / support',
    tone: 'border-[#5aa9ff]/40 bg-[#5aa9ff]/8 text-[#9cc9ff]',
    points: [
      'Read-oriented access for support, diagnostics and internal QA.',
      'Can open settings in read-only mode; local development may expose extra rights.',
    ],
  },
] as const;

export const ADMIN_INFO_GUIDE_SECTIONS = [
  {
    title: 'What this admin does',
    info: 'Short overview of the admin panel purpose.',
    points: [
      'Aggregates analytics, moderation queues and content management for both Echocode sites.',
      'Helps the team review submissions, monitor traffic quality and maintain portfolio and vacancy data.',
    ],
  },
  {
    title: 'How counts are calculated',
    info: 'High-level explanation of numbers shown across dashboards.',
    points: [
      'Traffic and geography metrics are based on tracked analytics events for the selected period.',
      'Submission metrics are counted from saved form records and their moderation statuses.',
      'Conversion-related widgets combine traffic events and matching submission totals within the same date range.',
    ],
  },
  {
    title: 'Site split',
    info: 'Explains how Echocode.digital and Echocode.app are separated in admin.',
    points: [
      '.digital contains agency traffic, partnership leads, vacancy candidates and portfolio content.',
      '.app contains product-site traffic and client submissions related to the app landing experience.',
    ],
  },
  {
    title: 'Where to look',
    info: 'Quick map of sections and their purpose.',
    points: [
      'Dashboard / .app Dashboard: traffic, geography, source mix and high-level conversion trends.',
      'Submissions tabs: moderation queues, status tracking and comment history by submission type.',
      'Vacancies and Portfolio: content management for public site sections.',
      'Info: operating notes, attribution rules and internal admin guidance.',
    ],
  },
] as const;
