'use client';

import Link from 'next/link';
import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionStatusBadge from '@/components/admin/client-submissions/shared/ClientSubmissionStatusBadge';
import EmailSubmissionMetaGrid from '@/components/admin/email-submissions/details/EmailSubmissionMetaGrid';
import ModerationCommentsPanel from '@/components/admin/shared/moderation/ModerationCommentsPanel';
import ModerationStatusSelect from '@/components/admin/shared/moderation/ModerationStatusSelect';
import { useEmailSubmissionDetails } from '@/components/admin/email-submissions/details/useEmailSubmissionDetails';

export default function EmailSubmissionDetails({ submissionId }: { submissionId: string }) {
  const {
    state,
    details,
    title,
    isStatusSaving,
    commentText,
    setCommentText,
    isCommentSaving,
    commentError,
    toast,
    clearToast,
    onStatusChange,
    onAddComment,
    getAllowedStatusOptions,
  } = useEmailSubmissionDetails(submissionId);

  if (state === 'loading') {
    return (
      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="h-6 w-48 animate-pulse rounded bg-gray16" />
        <div className="mt-4 h-30 animate-pulse rounded bg-gray10" />
      </article>
    );
  }

  if (state === 'error' || !details) {
    return (
      <article className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
        <p className="font-main text-main-sm text-[#ff6d7a]">
          Unable to load email submission details.
        </p>
      </article>
    );
  }

  return (
    <article className="space-y-4 rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <AdminToast toast={toast} onClose={clearToast} />

      <div>
        <Link
          href="/admin/submissions/emails"
          className="inline-flex items-center gap-2 
          rounded-(--radius-secondary) border border-gray16 
          px-2 py-1 
          font-main text-main-xs text-gray75 
          transition duration-main hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to all email submissions
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.15em] text-gray60">
            Email submission
          </p>
          <h2 className="font-title text-title-xl text-white break-all">{title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="font-main text-main-xs text-gray60">Current status</p>
            <ClientSubmissionStatusBadge status={details.status} />
          </div>
        </div>

        <ModerationStatusSelect
          id="email-submission-details-status"
          ariaLabel="Update email submission status"
          value={details.status}
          disabled={isStatusSaving}
          options={getAllowedStatusOptions(details.status)}
          onChange={onStatusChange}
        />
      </div>

      <EmailSubmissionMetaGrid details={details} />

      <ModerationCommentsPanel
        comments={details.comments ?? []}
        commentText={commentText}
        commentError={commentError}
        isSaving={isCommentSaving}
        onCommentTextChange={setCommentText}
        onSaveComment={onAddComment}
      />
    </article>
  );
}
