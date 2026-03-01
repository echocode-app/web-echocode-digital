'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ATTACHMENT_ACCEPT } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';

type ContactFileProps = {
  file: File | null;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onChange: (file: File | null) => void;
};

const ContactFile = ({ file, error, disabled, onBlur, onChange }: ContactFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        id="contact-file"
        ref={inputRef}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        className="hidden"
        aria-label="Attach file"
        title="Attach file"
        onBlur={onBlur}
        disabled={disabled}
        onChange={(e) => {
          const nextFile = e.target.files?.[0] ?? null;
          onChange(nextFile);
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-label="Attach file"
        title="Attach file"
        className="
         flex items-center gap-1 py-4 pl-4 pr-6 w-full text-left border rounded-secondary leading-3.5 
         hover:border-accent focus:border-accent duration-main transition-colors
       outline-0 text-[10px] font-title text-white placeholder:text-white 
        border-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70
        "
      >
        <div className="relative w-4.5 h-4.5">
          <Image src={'/UI/clip.svg'} alt="Clip" fill />
        </div>
        <span className="text-white truncate">{file?.name ?? 'Attach file (optional)'}</span>
      </button>
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

export default ContactFile;
