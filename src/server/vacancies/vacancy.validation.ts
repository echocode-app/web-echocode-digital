import { z } from 'zod';
import { VACANCY_LEVEL_VALUES } from '@/server/vacancies/vacancy.constants';

export const managedVacancyIdSchema = z.enum(['iosdev', 'qaengineer', 'designer']);

export const updateAdminVacancySchema = z
  .object({
    isPublished: z.boolean().optional(),
    hotPosition: z.boolean().optional(),
    level: z.enum(VACANCY_LEVEL_VALUES).nullable().optional(),
  })
  .refine(
    (value) =>
      value.isPublished !== undefined ||
      value.hotPosition !== undefined ||
      Object.prototype.hasOwnProperty.call(value, 'level'),
    {
      message: 'Provide at least one vacancy field to update',
    },
  );
