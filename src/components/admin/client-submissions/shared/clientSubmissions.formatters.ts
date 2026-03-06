import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { CLIENT_SUBMISSION_STATUS_SORT_PRIORITY } from './clientSubmissions.constants';

type ModerationListRow = {
  status: ClientSubmissionStatus;
  date: string;
};

export function sortRowsByStatusAndDate<T extends ModerationListRow>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const statusDelta = CLIENT_SUBMISSION_STATUS_SORT_PRIORITY[a.status] - CLIENT_SUBMISSION_STATUS_SORT_PRIORITY[b.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function formatDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { date: iso, time: '—' };
  }

  return {
    date: date.toISOString().slice(0, 10),
    time: date.toISOString().slice(11, 16),
  };
}

export function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export function formatTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toISOString().slice(11, 16);
}
