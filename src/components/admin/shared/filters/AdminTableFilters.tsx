import type { ReactNode } from 'react';
import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';

const panelClassName =
  'overflow-hidden rounded-(--radius-base) border border-gray16 bg-base-gray p-4';
const labelClassName = 'mb-1 block font-main text-main-xs text-gray60';
const fieldWrapClassName = 'min-w-0';
const selectClassName =
  'min-w-0 w-full max-w-full appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-2.5 py-2 pr-10 font-main text-main-xs text-white outline-none sm:px-3 sm:pr-12 sm:text-main-sm';
const dateInputClassName =
  'min-w-0 w-full max-w-full cursor-pointer rounded-(--radius-secondary) border border-gray16 bg-black/30 px-2.5 py-2 font-main text-main-xs text-white outline-none sm:px-3 sm:text-main-sm';
const actionButtonClassName =
  'w-full rounded-(--radius-secondary) px-3 py-2 font-title text-main-sm uppercase transition duration-main sm:text-title-xs';
const applyButtonClassName =
  `${actionButtonClassName} border border-accent text-white hover:bg-accent`;
const clearButtonClassName =
  `${actionButtonClassName} border border-gray16 bg-black/20 text-gray75 hover:border-gray60 hover:text-white`;

export function openAdminDatePicker(target: EventTarget | null) {
  if (!(target instanceof HTMLInputElement)) return;
  if (typeof target.showPicker === 'function') {
    try {
      target.showPicker();
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') {
        throw error;
      }
    }
  }
}

export function AdminTableFiltersPanel({
  columnsClassName,
  children,
}: {
  columnsClassName: string;
  children: ReactNode;
}) {
  return (
    <article className={panelClassName}>
      <div className={columnsClassName}>{children}</div>
    </article>
  );
}

export function AdminFilterSelect({
  id,
  label,
  value,
  ariaLabel,
  title,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  ariaLabel?: string;
  title?: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const labelId = `${id}-label`;
  const resolvedAriaLabel = ariaLabel ?? label;
  const resolvedTitle = title ?? label;

  return (
    <div className={fieldWrapClassName}>
      <label id={labelId} htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative min-w-0">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={resolvedAriaLabel}
          aria-labelledby={labelId}
          title={resolvedTitle}
          className={selectClassName}
        >
          {children}
        </select>
        <span className="absolute inset-y-0 right-4 flex items-center">
          <SelectChevron />
        </span>
      </div>
    </div>
  );
}

export function AdminFilterDateInput({
  id,
  label,
  value,
  ariaLabel,
  title,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  ariaLabel?: string;
  title?: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  const labelId = `${id}-label`;
  const resolvedAriaLabel = ariaLabel ?? label;
  const resolvedTitle = title ?? label;

  return (
    <div className={fieldWrapClassName}>
      <label id={labelId} htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onClick={(event) => openAdminDatePicker(event.currentTarget)}
        aria-label={resolvedAriaLabel}
        aria-labelledby={labelId}
        title={resolvedTitle}
        min={min}
        max={max}
        className={dateInputClassName}
      />
    </div>
  );
}

export function AdminFilterActions({
  onApply,
  onClear,
}: {
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex min-w-0 h-full flex-col">
      <span className="mb-1 block select-none font-main text-main-xs text-transparent">Actions</span>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <button type="button" onClick={onApply} className={applyButtonClassName}>
          Apply
        </button>
        <button type="button" onClick={onClear} className={clearButtonClassName}>
          Clear
        </button>
      </div>
    </div>
  );
}
