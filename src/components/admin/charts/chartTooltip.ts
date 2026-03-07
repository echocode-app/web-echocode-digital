import type { TooltipOptions } from 'chart.js';

export const ADMIN_CHART_TOOLTIP_BASE = {
  backgroundColor: 'rgba(20,20,20,0.96)',
  borderColor: 'rgba(255,255,255,0.16)',
  borderWidth: 1,
  titleColor: '#fff',
  bodyColor: 'rgba(255,255,255,0.82)',
  footerColor: 'rgba(255,255,255,0.66)',
  padding: 12,
  titleSpacing: 6,
  bodySpacing: 5,
  footerSpacing: 6,
  displayColors: true,
  boxPadding: 4,
  usePointStyle: true,
} satisfies Partial<TooltipOptions<'line' | 'bar' | 'doughnut'>>;

function currentYear(): number {
  return new Date().getFullYear();
}

export function formatTooltipIsoDate(dateIso: string): string {
  const date = new Date(`${dateIso}T12:00:00.000Z`);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatTooltipMonthLabel(month: string, year = currentYear()): string {
  const date = new Date(Date.UTC(year, Number(month) - 1, 1, 12, 0, 0, 0));
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatTooltipCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function formatTooltipPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
