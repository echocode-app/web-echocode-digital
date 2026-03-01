'use client';

import Link from 'next/link';
import Image from 'next/image';
import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionMetaGrid from '@/components/admin/client-submissions/details/ClientSubmissionMetaGrid';
import ClientSubmissionStatusSelect from '@/components/admin/client-submissions/details/ClientSubmissionStatusSelect';
import ClientSubmissionCommentsPanel from '@/components/admin/client-submissions/details/ClientSubmissionCommentsPanel';
import ClientSubmissionStatusBadge from '@/components/admin/client-submissions/shared/ClientSubmissionStatusBadge';
import { useClientSubmissionDetails } from '@/components/admin/client-submissions/details/useClientSubmissionDetails';

export default function ClientSubmissionDetails({ submissionId }: { submissionId: string }) {
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
  } = useClientSubmissionDetails(submissionId);

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
        <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load client submission details.</p>
      </article>
    );
  }

  return (
    <article className="space-y-4 rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <AdminToast toast={toast} onClose={clearToast} />

      <div>
        <Link
          href="/admin/submissions/clients"
          className="inline-flex items-center gap-2 rounded-(--radius-secondary) border border-gray16 px-2 py-1 font-main text-main-xs text-gray75 transition duration-main hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to all submissions
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.15em] text-gray60">Client submission</p>
          <h2 className="font-title text-title-xl text-white">{title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="font-main text-main-xs text-gray60">Current status</p>
            <ClientSubmissionStatusBadge status={details.status} />
          </div>
        </div>

        <ClientSubmissionStatusSelect
          value={details.status}
          disabled={isStatusSaving}
          options={getAllowedStatusOptions(details.status)}
          onChange={onStatusChange}
        />
      </div>

      <ClientSubmissionMetaGrid details={details} />

      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <p className="font-main text-main-xs text-gray60">Description</p>
        <p className="mt-1 whitespace-pre-wrap font-main text-main-sm text-white">{details.description || '—'}</p>
      </div>

      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <p className="font-main text-main-xs text-gray60">Files</p>
        {details.imageUrl ? (
          <div className="mt-2 rounded-(--radius-secondary) border border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] p-2.5">
            <a
              href={details.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-2"
            >
              <span className="relative mt-0.5 block h-4.5 w-4.5 shrink-0">
                <Image src="/UI/clip.svg" alt="" fill aria-hidden="true" className="h-auto w-auto" />
              </span>
              <span className="min-w-0">
                <span className="block break-all font-main text-main-sm text-black group-hover:text-black/80">
                  {details.imageName?.trim() || 'Attached file'}
                </span>
                <span className="mt-0.5 block font-main text-main-xs text-black/70">
                  Open file
                </span>
              </span>
            </a>
          </div>
        ) : (
          <p className="mt-1 font-main text-main-sm text-white">—</p>
        )}
      </div>

      <ClientSubmissionCommentsPanel
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
