import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import { ECHOCODE_APP_SUBMISSION_STATUS_SORT_PRIORITY } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.constants';
import { getAdminDateIso, getAdminDateTimeLabel, getAdminTimeIso } from '@/shared/time/europeKiev';

type EchocodeModerationRow = {
  status: SubmissionListStatus;
  createdAt: string;
};

export function sortRowsByStatusAndDate<T extends EchocodeModerationRow>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const statusDelta =
      ECHOCODE_APP_SUBMISSION_STATUS_SORT_PRIORITY[a.status] -
      ECHOCODE_APP_SUBMISSION_STATUS_SORT_PRIORITY[b.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function formatDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { date: iso, time: '—' };
  }

  return getAdminDateTimeLabel(date);
}

export function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return getAdminDateIso(date);
}

export function formatTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return getAdminTimeIso(date);
}
