import Link from 'next/link';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import { ADMIN_INFO_SECTION_CARD_CLASS_NAME } from '@/components/admin/info/adminInfo.config';

type AdminInfoGuideCardProps = {
  title: string;
  info: string;
  points: readonly string[];
  links?: ReadonlyArray<{
    href: string;
    label: string;
    external?: boolean;
  }>;
};

export default function AdminInfoGuideCard({
  title,
  info,
  points,
  links = [],
}: AdminInfoGuideCardProps) {
  return (
    <article className={ADMIN_INFO_SECTION_CARD_CLASS_NAME}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-title text-title-sm text-white">{title}</h3>
        <InfoTooltip label={`${title} help`} text={info} />
      </div>

      <div className="mt-3 grid gap-2 font-main text-main-sm text-gray75">
        {points.map((point) => (
          <p key={point}>{point}</p>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={`${title}-${link.href}`}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="
                rounded-(--radius-secondary)
                border border-gray16/80
                bg-black/20
                px-3 py-2
                font-main text-main-xs text-gray75
                transition duration-main
                hover:border-gray16 hover:text-white
              "
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
