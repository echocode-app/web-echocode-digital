import type {
  DashboardKpiDto,
  DashboardPeriod,
  DashboardGeographyCountryDto,
} from '@/server/admin/dashboard/dashboard.types';
import type { ListSubmissionsResponseDto } from '@/server/submissions/submissions.types';

export type EchocodeAppTopPageDto = {
  path: string;
  views: number;
  sharePct: number;
};

export type EchocodeAppReferrerDto = {
  label: string;
  views: number;
  sharePct: number;
};

export type EchocodeAppOverviewDto = {
  period: DashboardPeriod;
  siteId: 'echocode_app';
  siteHost: string;
  kpis: {
    pageViews: DashboardKpiDto;
    submissions: DashboardKpiDto;
    conversionRate: DashboardKpiDto;
    countries: DashboardKpiDto;
  };
  geography: {
    totalPageViews: number;
    countries: DashboardGeographyCountryDto[];
  };
  topPages: EchocodeAppTopPageDto[];
  referrers: EchocodeAppReferrerDto[];
};

export type EchocodeAppSubmissionsDto = ListSubmissionsResponseDto;
