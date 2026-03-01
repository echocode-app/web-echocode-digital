type ClientSubmissionsPaginationProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function ClientSubmissionsPagination({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: ClientSubmissionsPaginationProps) {
  if (!canGoPrev && !canGoNext) return null;

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      {canGoPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="rounded-(--radius-secondary) border border-gray16 px-3 py-1.5 font-main text-main-xs text-gray75 transition duration-main hover:text-white"
        >
          Prev
        </button>
      ) : null}
      {canGoNext ? (
        <button
          type="button"
          onClick={onNext}
          className="rounded-(--radius-secondary) border border-gray16 px-3 py-1.5 font-main text-main-xs text-gray75 transition duration-main hover:text-white"
        >
          Next
        </button>
      ) : null}
    </div>
  );
}
