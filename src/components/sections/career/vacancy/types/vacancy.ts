export interface CareerData {
  translateKey: string;
  heroSection: VacancyHeroSection;
  valueSection: ValueSection;
  descriptionSections: DescriptionSection[];
  selectionSection: SelectionStep[];
}

export interface VacancyHeroSection {
  image: { path: string };
}

export interface ValueSection {
  title: string;
  subtitle: string;
}

export interface DescriptionSection {
  title: string;
  values: DescriptionItemType[];
}

export interface DescriptionItemType {
  title: string;
  desc: string;
}

export interface SelectionStep {
  title: string;
  subTitle: string;
  desc: string;
}

export interface VacancyData {
  vacancyId: string;
  vacancySlug?: string;
  vacancyTitle?: string;
  level?: string | null;
  conditions?: string[];
  employmentType?: string;
}
