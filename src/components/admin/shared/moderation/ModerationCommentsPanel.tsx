import type { ModerationCommentDto } from '@/server/forms/shared/moderation.types';
import { getAdminDateIso, getAdminTimeIso } from '@/shared/time/europeKiev';

type ModerationCommentsPanelProps = {
  comments: ModerationCommentDto[];
  commentText: string;
  commentError: string | null;
  isSaving: boolean;
  onCommentTextChange: (value: string) => void;
  onSaveComment: () => void;
  textareaLabel?: string;
};

function formatCommentAuthor(comment: ModerationCommentDto): string {
  if (comment.authorProfile) {
    return [
      comment.authorProfile.displayName,
      comment.authorProfile.roleLabel,
      comment.authorProfile.uid,
    ].filter(Boolean).join(' · ');
  }

  return comment.authorEmail ?? comment.authorUid;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return getAdminDateIso(date);
}

function formatTime(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return getAdminTimeIso(date);
}

export default function ModerationCommentsPanel({
  comments,
  commentText,
  commentError,
  isSaving,
  onCommentTextChange,
  onSaveComment,
  textareaLabel = 'Comment',
}: ModerationCommentsPanelProps) {
  return (
    <>
      <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
        <p className="font-main text-main-xs text-gray60">{textareaLabel}</p>
        <textarea
          value={commentText}
          onChange={(event) => onCommentTextChange(event.target.value)}
          rows={3}
          placeholder="Optional moderator comment"
          className="mt-2 w-full resize-y rounded-(--radius-secondary) 
          border border-gray16 bg-black/30 px-3 py-2 
          font-main text-main-sm text-white outline-none"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="font-main text-main-xs text-[#ff6d7a]">{commentError ?? ''}</p>
          <button
            type="button"
            onClick={onSaveComment}
            disabled={isSaving || commentText.trim().length === 0}
            className="rounded-(--radius-secondary) border border-gray16 
            px-3 py-1.5 font-main text-main-xs text-gray75 
            transition duration-main hover:text-white 
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save comment'}
          </button>
        </div>
      </div>

      <div
        className="rounded-(--radius-secondary) border border-[#ffd38e] 
        bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] p-3"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-main text-main-xs uppercase tracking-[0.12em] text-black/75">
            Comment log
          </p>
          <span
            className="rounded-(--radius-secondary) border border-[#ffc978] 
            bg-white/55 px-2 py-0.5 font-main text-main-xs text-black/70"
          >
            {comments.length}
          </span>
        </div>
        {comments.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-(--radius-secondary) border border-[#ffd38e] bg-white p-2"
              >
                <p className="font-main text-main-xs text-black/65">
                  {formatCommentAuthor(comment)} · {formatDate(comment.createdAt)}{' '}
                  {formatTime(comment.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap font-main text-main-sm text-black">
                  {comment.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 font-main text-main-sm text-black/70">—</p>
        )}
      </div>
    </>
  );
}
