import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';

type ClientSubmissionStatusSelectProps = {
  value: ClientSubmissionStatus;
  disabled?: boolean;
  options: ClientSubmissionStatus[];
  onChange: (value: ClientSubmissionStatus) => void;
};

export default function ClientSubmissionStatusSelect({
  value,
  disabled,
  options,
  onChange,
}: ClientSubmissionStatusSelectProps) {
  return (
    <div className="relative">
      <select
        id="client-submission-details-status"
        value={value}
        onChange={(event) => onChange(event.target.value as ClientSubmissionStatus)}
        disabled={disabled}
        aria-label="Update submission status"
        title="Update submission status"
        className="appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 pr-11 font-main text-main-sm text-white outline-none disabled:opacity-60"
      >
        {options.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <span className="absolute inset-y-0 right-3 flex items-center">
        <SelectChevron />
      </span>
    </div>
  );
}
