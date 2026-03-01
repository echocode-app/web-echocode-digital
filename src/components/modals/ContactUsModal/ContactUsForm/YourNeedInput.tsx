type YourNeedsInputProps = {
  value: string;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

const YourNeedsInput = ({ value, error, disabled, onBlur, onChange }: YourNeedsInputProps) => {
  return (
    <div className="relative">
      <label
        htmlFor="needs"
        className=" absolute top-2 left-4
       text-[10px] font-title text-white border-white"
      >
        About your needs...
      </label>
      <input
        type="text"
        id="needs"
        name="needs"
        placeholder="e.g. Mobile app design for a fintech startup"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-label="About your needs"
        title="About your needs"
        aria-invalid={error ? 'true' : 'false'}
        className="block pt-6.5 pb-2 pl-4 pr-6 border rounded-secondary leading-3.5 w-full
         hover:border-accent focus:border-accent duration-main transition-colors
       outline-0 text-main-xs font-main text-white placeholder:text-primary-gray  border-white"
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
};

export default YourNeedsInput;
