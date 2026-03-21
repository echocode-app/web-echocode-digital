import type { SidebarBadgeMap, SidebarNavSection } from '@/components/admin/sidebar/sidebar.types';

export function resolveSidebarNestedAccent(parentHref?: string): string {
  if (parentHref === '/admin/submissions') return 'border-accent';
  if (parentHref === '/admin/vacancies') return 'border-[#ffd38e]';
  if (parentHref === '/admin/echocode-app') return 'border-[#5aa9ff]';
  return 'border-gray16';
}

export function resolveSidebarBadgeClasses(parentHref?: string): string {
  if (parentHref === '/admin/submissions') {
    return 'border-accent/50 bg-accent/12 text-accent';
  }

  if (parentHref === '/admin/vacancies') {
    return 'border-[#ffd38e]/45 bg-[#ffd38e]/12 text-[#ffd38e]';
  }

  if (parentHref === '/admin/echocode-app') {
    return 'border-[#5aa9ff]/45 bg-[#5aa9ff]/12 text-[#9cc9ff]';
  }

  return 'border-gray16 bg-gray10 text-gray75';
}

export function buildSidebarSections(input: {
  badges: SidebarBadgeMap;
}): SidebarNavSection[] {
  const { badges } = input;

  return [
    {
      title: 'Echocode.digital',
      items: [
        { href: '/admin/dashboard', label: '.digital Dashboard', visible: true },
        { href: '/admin/submissions', label: 'Submissions metrics', visible: true },
        {
          href: '/admin/submissions/clients',
          label: 'Clients',
          visible: true,
          parentHref: '/admin/submissions',
          badgeCount: badges['/admin/submissions/clients'],
        },
        {
          href: '/admin/submissions/emails',
          label: 'Emails',
          visible: true,
          parentHref: '/admin/submissions',
          badgeCount: badges['/admin/submissions/emails'],
        },
        { href: '/admin/vacancies', label: 'Vacancies', visible: true },
        {
          href: '/admin/vacancies/candidates',
          label: 'Candidates',
          visible: true,
          parentHref: '/admin/vacancies',
          badgeCount: badges['/admin/vacancies/candidates'],
        },
        { href: '/admin/portfolio', label: 'Portfolio', visible: true },
      ],
    },
    {
      title: 'Echocode.app',
      items: [
        { href: '/admin/echocode-app', label: '.app Dashboard', visible: true },
        {
          href: '/admin/echocode-app/submissions',
          label: 'Clients',
          visible: true,
          parentHref: '/admin/echocode-app',
          badgeCount: badges['/admin/echocode-app/submissions'],
        },
      ],
    },
    {
      title: 'Shared',
      items: [
        // Keep logs route out of navigation for now to reduce emphasis on broad action logging.
        // { href: '/admin/logs', label: 'Logs', visible: true },
        { href: '/admin/info', label: 'Info', visible: true },
      ],
    },
  ];
}
