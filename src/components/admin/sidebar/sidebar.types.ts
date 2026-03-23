export type SidebarProps = {
  role: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export type SidebarBadgeMap = Record<string, number>;

export type SidebarNavItem = {
  href: string;
  label: string;
  visible: boolean;
  parentHref?: string;
  badgeCount?: number;
};

export type SidebarNavSection = {
  title: string;
  items: SidebarNavItem[];
};
