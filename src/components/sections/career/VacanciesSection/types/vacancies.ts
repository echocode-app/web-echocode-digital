export interface Vacancy {
  hotPosition?: boolean;
  vacancyId: string; // iosdev
  vacancySlug?: string; // /career/[slug] - iosdev
  vacancyTitle: string; // card title - iOS Developer
  level?: string; // Level - Trainee
  conditions?: string[]; // ["Engineering", "Remote"]
  employmentType: string; // Hero sublabel - Full-time
}
