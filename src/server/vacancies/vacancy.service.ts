import { logAdminAction } from '@/server/admin/admin-logs.service';
import { VACANCY_LEVEL_VALUES } from '@/server/vacancies/vacancy.constants';
import {
  getManagedVacancyRecordBySlug,
  listManagedVacancyRecords,
  updateManagedVacancyRecord,
} from '@/server/vacancies/vacancy.repository';
import type {
  AdminVacancyListItemDto,
  ManagedVacancyRecord,
  PublicVacancyListItem,
  UpdateAdminVacancyInput,
} from '@/server/vacancies/vacancy.types';

function toPublicVacancyItem(item: ManagedVacancyRecord): PublicVacancyListItem {
  return {
    vacancyId: item.vacancyId,
    vacancySlug: item.vacancySlug,
    vacancyTitle: item.vacancyTitle,
    level: item.level,
    conditions: item.conditions,
    employmentType: item.employmentType,
    hotPosition: item.hotPosition,
  };
}

function sortPublicVacancies(a: ManagedVacancyRecord, b: ManagedVacancyRecord): number {
  if (a.hotPosition !== b.hotPosition) {
    return a.hotPosition ? -1 : 1;
  }

  return a.sortOrder - b.sortOrder;
}

export async function listPublicVacancies(): Promise<PublicVacancyListItem[]> {
  const records = await listManagedVacancyRecords();

  return records
    .filter((item) => item.isPublished)
    .sort(sortPublicVacancies)
    .map(toPublicVacancyItem);
}

export async function getPublicVacancyBySlug(slug: string): Promise<PublicVacancyListItem | null> {
  const record = await getManagedVacancyRecordBySlug(slug);

  if (!record || !record.isPublished) {
    return null;
  }

  return toPublicVacancyItem(record);
}

export async function listAdminVacancies(): Promise<AdminVacancyListItemDto[]> {
  const records = await listManagedVacancyRecords();

  return records
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      ...item,
      availableLevels: VACANCY_LEVEL_VALUES,
    }));
}

export async function updateAdminVacancy(
  input: UpdateAdminVacancyInput,
): Promise<AdminVacancyListItemDto> {
  const updated = await updateManagedVacancyRecord(input);

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'vacancies.manage',
    entityType: 'vacancy',
    entityId: input.vacancyId,
    metadata: {
      adminEmail: input.adminEmail ?? null,
      isPublished: updated.isPublished,
      hotPosition: updated.hotPosition,
      level: updated.level,
    },
  });

  return {
    ...updated,
    availableLevels: VACANCY_LEVEL_VALUES,
  };
}

export async function countEffectiveActiveVacancies(): Promise<number> {
  const records = await listManagedVacancyRecords();
  return records.filter((item) => item.isPublished).length;
}
