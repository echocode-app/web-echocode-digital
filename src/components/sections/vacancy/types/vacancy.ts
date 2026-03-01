export interface CareerData {
  valueSection: ValueSection;
  descriptionSections: DescriptionSection[];
  selectionSection: SelectionStep[];
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
