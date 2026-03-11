'use client';

import Link from 'next/link';
import Image from 'next/image';
import AdminToast from '@/components/admin/ui/AdminToast';
import EchocodeAppSubmissionMetaGrid from '@/components/admin/echocode-app/details/EchocodeAppSubmissionMetaGrid';
import EchocodeAppSubmissionStatusBadge from '@/components/admin/echocode-app/shared/EchocodeAppSubmissionStatusBadge';
import ModerationCommentsPanel from '@/components/admin/shared/moderation/ModerationCommentsPanel';
import ModerationStatusSelect from '@/components/admin/shared/moderation/ModerationStatusSelect';
import { useEchocodeAppSubmissionDetails } from '@/components/admin/echocode-app/details/useEchocodeAppSubmissionDetails';

export default function EchocodeAppSubmissionDetails({ submissionId }: { submissionId: string }) {
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
  } = useEchocodeAppSubmissionDetails(submissionId);

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
          Unable to load echocode.app submission details.
        </p>
      </article>
    );
  }

  const attachment = details.attachments[0] ?? null;

  return (
    <article className="space-y-4 rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <AdminToast toast={toast} onClose={clearToast} />

      <div>
        <Link
          href="/admin/echocode-app/submissions"
          className="inline-flex items-center gap-2 rounded-(--radius-secondary) 
          border border-gray16 px-2 py-1 font-main text-main-xs text-gray75 
          transition duration-main hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to all submissions
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.15em] text-gray60">
            Echocode.app submission
          </p>
          <h2 className="font-title text-title-xl text-white">{title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="font-main text-main-xs text-gray60">Current status</p>
            <EchocodeAppSubmissionStatusBadge status={details.status} />
          </div>
        </div>

        <ModerationStatusSelect
          id="echocode-app-submission-details-status"
          ariaLabel="Update echocode.app submission status"
          value={details.status}
          disabled={isStatusSaving}
          options={getAllowedStatusOptions(details.status)}
          onChange={onStatusChange}
        />
      </div>

      <EchocodeAppSubmissionMetaGrid details={details} />

      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <p className="font-main text-main-xs text-gray60">Needs / message</p>
        <p className="mt-1 whitespace-pre-wrap font-main text-main-sm text-white">
          {details.content.message || '—'}
        </p>
      </div>

      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <p className="font-main text-main-xs text-gray60">Files</p>
        {attachment?.url ? (
          <div
            className="mt-2 rounded-(--radius-secondary) border border-[#ffd38e] 
            bg-[linear-gradient(90deg,#b7a56f,#ffe9f2)] p-2.5 
            transition-all duration-main hover:border-[#ffe9f2]"
          >
            <a
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-2"
            >
              <span className="relative mt-0.5 block h-4.5 w-4.5 shrink-0">
                <Image
                  src="/UI/clip.svg"
                  alt=""
                  fill
                  aria-hidden="true"
                  className="h-auto w-auto"
                />
              </span>
              <span className="min-w-0">
                <span className="block break-all font-main text-main-sm text-black group-hover:text-black/80">
                  {attachment.originalName.trim() || 'Attached file'}
                </span>
                <span className="mt-0.5 block font-main text-main-xs text-black/70">Open file</span>
              </span>
            </a>
          </div>
        ) : (
          <p className="mt-1 font-main text-main-sm text-white">—</p>
        )}
      </div>

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
