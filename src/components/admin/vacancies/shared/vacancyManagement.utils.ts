import type { AdminVacancyListItemDto } from '@/server/vacancies';
import type { VacancyCardState } from '@/components/admin/vacancies/shared/vacancyManagement.types';

export function toVacancyCardState(item: AdminVacancyListItemDto): VacancyCardState {
  return {
    isPublished: item.isPublished,
    hotPosition: item.hotPosition,
    level: item.level,
  };
}

export function getLevelLabel(level: VacancyCardState['level']): string {
  return level ?? 'Not specified';
}

export function getUpdatedByValue(item: AdminVacancyListItemDto): string {
  return item.updatedByProfile?.displayName || item.updatedBy || '—';
}

export function getUpdatedByMeta(item: AdminVacancyListItemDto): string | null {
  if (!item.updatedByProfile) return null;

  return [item.updatedByProfile.roleLabel, item.updatedByProfile.uid].filter(Boolean).join(' · ');
}
