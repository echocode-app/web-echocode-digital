'use client';

type InfoTooltipProps = {
  text: string;
  label: string;
  icon?: string;
  buttonClassName?: string;
};

export default function InfoTooltip({
  text,
  label,
  icon = 'ⓘ',
  buttonClassName = '',
}: InfoTooltipProps) {
  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        aria-label={label}
        className={`inline-flex h-5 w-5 items-center justify-center 
          rounded-full border border-transparent 
          bg-black/30 font-main text-main-xs 
          leading-none text-gray75 
          transition duration-main hover:text-accent-hover 
          focus-visible:text-accent-hover focus-visible:outline-none focus-visible:ring-1 
          focus-visible:ring-accent-hover ${buttonClassName}`}
      >
        {icon}
      </button>
      <div className="pointer-events-none absolute right-0 top-full 
      z-70 mt-2 w-[min(260px,calc(100vw-2rem))] o
      rigin-top-right scale-95 
      rounded-(--radius-secondary) border border-gray16 bg-base-gray 
      p-3 font-main text-main-xs text-gray75 
      opacity-0 shadow-button 
      transition duration-main 
      group-hover:scale-100 group-hover:opacity-100
       group-focus-within:scale-100 group-focus-within:opacity-100">
        {text}
      </div>
    </div>
  );
}
