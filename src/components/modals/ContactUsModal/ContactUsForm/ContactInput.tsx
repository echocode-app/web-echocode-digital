'use client';

function splitRequiredMarker(label: string): { text: string; requiredMark: string | null } {
  if (!label.endsWith('*')) {
    return { text: label, requiredMark: null };
  }

  return {
    text: label.slice(0, -1),
    requiredMark: '*',
  };
}

type ContactInputProps = {
  label: string;
  name: string;
  value: string;
  error?: string;
  type?: 'text' | 'email';
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

export default function ContactInput({
  label,
  name,
  value,
  error,
  type = 'text',
  autoComplete,
  required,
  disabled,
  onBlur,
  onChange,
}: ContactInputProps) {
  const inputId = `contact-input-${name}`;
  const { text: visibleLabel, requiredMark } = splitRequiredMarker(label);

  return (
    <div className="relative w-full">
      <label htmlFor={inputId} className="sr-only font-main">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder=""
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-label={label}
        title={label}
        aria-invalid={error ? true : undefined}
        className={`w-full h-14 px-4
           hover:border-accent focus:border-accent duration-main transition-colors
          border border-white text-[10px] rounded-secondary
          bg-transparent
          text-white font-title font-bold uppercase
          outline-none no-autofill-bg
        `}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 left-4 flex items-center gap-[1px] transition-opacity duration-main ${
          value ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        <span className="font-title text-[10px] font-bold uppercase text-white">
          {visibleLabel}
        </span>
        {requiredMark ? (
          <span className="font-main text-[10px] font-bold text-white">{requiredMark}</span>
        ) : null}
      </div>
      <div className="pointer-events-none absolute left-1 top-[calc(100%)] md:top-[calc(100%+4px)] h-4 overflow-hidden">
        <p
          className={`text-[10px] text-[#ff8d8d] transition-opacity duration-main ${
            error ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          {error ?? ' '}
        </p>
      </div>
    </div>
  );
}
