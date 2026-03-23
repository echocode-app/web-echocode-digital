import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import AdminInfoGuideCard from '@/components/admin/info/AdminInfoGuideCard';
import AdminRoleAccessCard from '@/components/admin/info/AdminRoleAccessCard';
import {
  ADMIN_INFO_GUIDE_SECTIONS,
  ADMIN_INFO_SECTION_CARD_CLASS_NAME,
  ADMIN_ROLE_ACCESS,
} from '@/components/admin/info/adminInfo.config';

const GUIDE_SECTION_LINKS: Record<
  string,
  ReadonlyArray<{ href: string; label: string; external?: boolean }>
> = {
  'Site split': [
    { href: 'https://www.echocode.digital/', label: 'echocode.digital', external: true },
    { href: 'https://www.echocode.app/', label: 'echocode.app', external: true },
    { href: '/admin/dashboard', label: '.digital Dashboard' },
    { href: '/admin/echocode-app', label: '.app Dashboard' },
  ],
  'Where to look': [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/echocode-app', label: '.app Dashboard' },
    { href: '/admin/submissions', label: 'Submissions' },
    { href: '/admin/vacancies', label: 'Vacancies' },
    { href: '/admin/portfolio', label: 'Portfolio' },
    { href: '/admin/info/utm', label: 'Info / UTM' },
    { href: '/admin/settings', label: 'Settings' },
  ],
};

export default function AdminInfoOverview() {
  return (
    <div className="space-y-5">
      <article className={ADMIN_INFO_SECTION_CARD_CLASS_NAME}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h2 className="font-title text-title-base text-white">Admin guide overview</h2>
            <p className="max-w-220 font-main text-main-sm text-gray60">
              This section explains what each admin area is responsible for, how the main metrics
              are derived, and which roles can work with which parts of the panel.
            </p>
          </div>
          <InfoTooltip
            label="Admin guide overview help"
            text="Use this page as the short operating guide for the admin panel. Keep it practical, current and easy to scan before working with moderation queues or analytics."
          />
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        {ADMIN_INFO_GUIDE_SECTIONS.map((section) => (
          <AdminInfoGuideCard
            key={section.title}
            title={section.title}
            info={section.info}
            points={section.points}
            links={GUIDE_SECTION_LINKS[section.title]}
          />
        ))}
      </div>

      <article className={ADMIN_INFO_SECTION_CARD_CLASS_NAME}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 className="font-title text-title-base text-white">Role access map</h2>
            <p className="font-main text-main-sm text-gray60">
              Use the same role semantics as in settings when assigning access for operations,
              support and internal admin management.
            </p>
          </div>
          <InfoTooltip
            label="Role access map help"
            text="Color coding matches the settings page so role meanings stay consistent across the admin panel."
          />
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {ADMIN_ROLE_ACCESS.map((item) => (
            <AdminRoleAccessCard
              key={item.role}
              role={item.role}
              badge={item.badge}
              tone={item.tone}
              points={item.points}
            />
          ))}
        </div>
      </article>
    </div>
  );
}
