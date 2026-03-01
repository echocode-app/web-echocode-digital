'use client';

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

  return (
    <div className="relative w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      {!value && (
        <span
          className="
            pointer-events-none
            absolute left-4 top-1/2 -translate-y-1/2  text-white text-[10px] font-title
          "
        >
          {label}
        </span>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-label={label}
        title={label}
        aria-invalid={error ? 'true' : 'false'}
        className="
          w-full h-14
          px-4
           hover:border-accent focus:border-accent duration-main transition-colors
          border border-white rounded-secondary
          bg-transparent
          text-white text-[10px] font-title
          outline-none
        "
      />
      <div className="pointer-events-none absolute left-1 top-[calc(100%+4px)] h-4 overflow-hidden">
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
