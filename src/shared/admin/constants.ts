export const ADMIN_MONTH_SHORT_LABELS_EN: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const CLIENT_SUBMISSION_STATUS_VALUES = [
  'new',
  'viewed',
  'processed',
  'rejected',
  'deferred',
] as const;

export const EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS = {
  new: 0,
  viewed: 0,
  processed: 0,
  rejected: 0,
  deferred: 0,
} as const;

