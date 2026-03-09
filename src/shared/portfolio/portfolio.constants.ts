export const PORTFOLIO_PLATFORM_VALUES = ['ios', 'android', 'web', 'unity'] as const;

export const PORTFOLIO_CATEGORY_VALUES = [
  'e-commerce',
  'utility',
  'igaming',
  'health',
  'education',
  'everyday',
  'creative',
  'travel',
] as const;

export const PORTFOLIO_PLATFORM_OPTIONS = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'unity', label: 'Unity' },
] as const;

export const PORTFOLIO_CATEGORY_OPTIONS = [
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'utility', label: 'Utility' },
  { value: 'igaming', label: 'iGaming' },
  { value: 'health', label: 'Health & Well-being' },
  { value: 'education', label: 'Education' },
  { value: 'everyday', label: 'Everyday Use' },
  { value: 'creative', label: 'Creative' },
  { value: 'travel', label: 'Travel' },
] as const;

export const PORTFOLIO_PREVIEW_ENTRY_TYPE = 'preview_card';
