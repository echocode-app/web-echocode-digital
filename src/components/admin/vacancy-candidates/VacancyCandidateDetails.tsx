'use client';

import Link from 'next/link';
import Image from 'next/image';
import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionStatusBadge from '@/components/admin/client-submissions/shared/ClientSubmissionStatusBadge';
import ModerationCommentsPanel from '@/components/admin/shared/moderation/ModerationCommentsPanel';
import ModerationStatusSelect from '@/components/admin/shared/moderation/ModerationStatusSelect';
import VacancyCandidateMetaGrid from '@/components/admin/vacancy-candidates/details/VacancyCandidateMetaGrid';
import { useVacancyCandidateDetails } from '@/components/admin/vacancy-candidates/details/useVacancyCandidateDetails';

export default function VacancyCandidateDetails({ submissionId }: { submissionId: string }) {
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
  } = useVacancyCandidateDetails(submissionId);

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
          Unable to load candidate submission details.
        </p>
      </article>
    );
  }

  return (
    <article className="space-y-4 rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <AdminToast toast={toast} onClose={clearToast} />

      <div>
        <Link
          href="/admin/vacancies/candidates"
          className="inline-flex items-center gap-2 
          rounded-(--radius-secondary) 
          border border-gray16 
          px-2 py-1 
          font-main text-main-xs text-gray75 
          transition duration-main hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to all candidate submissions
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.15em] text-gray60">
            Candidate submission
          </p>
          <h2 className="font-title text-title-xl text-white">{title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <p className="font-main text-main-xs text-gray60">Current status</p>
            <ClientSubmissionStatusBadge status={details.status} />
          </div>
        </div>

        <ModerationStatusSelect
          id="vacancy-submission-details-status"
          ariaLabel="Update candidate submission status"
          value={details.status}
          disabled={isStatusSaving}
          options={getAllowedStatusOptions(details.status)}
          onChange={onStatusChange}
        />
      </div>

      <VacancyCandidateMetaGrid details={details} />

      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <div className="mt-2 flex flex-col lg:flex-row gap-2">
          <a
            href={details.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-(--radius-secondary) 
            border border-[#8f6bff]/35 
            p-2.5 
            flex items-center justify-center"
          >
            Open LinkedIn / GitHub profile
          </a>
          {details.cvUrl ? (
            <div
              className="w-full rounded-(--radius-secondary) 
            border border-[#8f6bff]/35 
            bg-[linear-gradient(90deg,rgba(115,89,255,0.14),rgba(170,128,255,0.12))] 
            p-2.5 
            flex items-center justify-center"
            >
              <a
                href={details.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 lg:gap-4"
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
                  <span className="block break-all font-main text-main-sm text-white group-hover:text-white/85">
                    {details.cvFile.originalName || 'Candidate CV'}
                  </span>
                  <span className="mt-0.5 block font-main text-main-xs text-[#d7cbff]/70">
                    open file
                  </span>
                </span>
              </a>
            </div>
          ) : (
            <div
              className="rounded-(--radius-secondary) 
            border border-[#8f6bff]/35 
            bg-[linear-gradient(90deg,rgba(115,89,255,0.14),rgba(170,128,255,0.12))] 
            px-3 py-2 
            font-main text-main-sm text-white"
            >
              <div className="flex items-start gap-2">
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
                  <span className="block break-all">
                    {details.cvFile.originalName || 'Candidate CV'}
                  </span>
                  <span className="mt-0.5 block text-main-xs text-[#d7cbff]/70">
                    Stored file path: {details.cvFile.path}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
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
