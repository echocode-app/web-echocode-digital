import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';

type ModerationStatusSelectProps<TStatus extends string> = {
  value: TStatus;
  disabled?: boolean;
  options: TStatus[];
  onChange: (value: TStatus) => void;
  id: string;
  ariaLabel: string;
};

export default function ModerationStatusSelect<TStatus extends string>({
  value,
  disabled,
  options,
  onChange,
  id,
  ariaLabel,
}: ModerationStatusSelectProps<TStatus>) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as TStatus)}
        disabled={disabled}
        aria-label={ariaLabel}
        title={ariaLabel}
        className="appearance-none rounded-(--radius-secondary) 
        border border-gray16 bg-black/30 px-3 py-2 pr-11 
        font-main text-main-sm text-white outline-none disabled:opacity-60"
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <span className="absolute inset-y-0 right-3 flex items-center">
        <SelectChevron />
      </span>
    </div>
  );
}
