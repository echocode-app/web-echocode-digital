export {
  emailSubmissionCreateSchema,
  emailSubmissionListQuerySchema,
  emailSubmissionIdQuerySchema,
  addEmailSubmissionCommentSchema,
  updateEmailSubmissionStatusSchema,
} from '@/server/forms/email-submission/emailSubmission.validation';

export {
  createEmailSubmission,
} from '@/server/forms/email-submission/emailSubmission.public.service';

export {
  getAdminEmailSubmissionDetails,
  getAdminEmailSubmissionsOverview,
  listAdminEmailSubmissions,
  addAdminEmailSubmissionComment,
  setAdminEmailSubmissionStatus,
  softDeleteAdminEmailSubmission,
} from '@/server/forms/email-submission/emailSubmission.admin.service';

export type {
  AddEmailSubmissionCommentResponseDto,
  CreateEmailSubmissionResponseDto,
  EmailSubmissionDetailsDto,
  EmailSubmissionListItemDto,
  EmailSubmissionRecordDto,
  EmailSubmissionsListResponseDto,
  EmailSubmissionsOverviewDto,
  SoftDeleteEmailSubmissionResponseDto,
  UpdateEmailSubmissionStatusResponseDto,
} from '@/server/forms/email-submission/emailSubmission.types';
