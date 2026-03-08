'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import SubmitArrow from './SubmitArrow';
import { submitEmail } from './api/submitEmail';
import { emailSchema } from './shemas/emailSchema';

type FormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
};

const MailForm = () => {
  const [state, setState] = useState<FormState>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations('Layout.Footer');

  const handleLocalValidate = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = emailSchema.safeParse({ email: value });

    setLocalError(result.success ? null : result.error.flatten().fieldErrors.email?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setLocalError(result.error.flatten().fieldErrors.email?.[0] || null);
      return;
    }

    setLocalError(null);

    const response = await submitEmail(formData);
    setState(response);

    if (response.success) {
      formRef.current?.reset();
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const errorMessage = localError || state.fieldErrors?.email?.[0] || state.error;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative md:hidden flex justify-between items-center gap-4 w-full mb-12 pl-3.5 pr-6 py-2
      hover:border-accent focus-within:border-accent duration-main transition-colors
      rounded-secondary border-gray60 border"
    >
      <div className="relative flex flex-col gap-1 w-full no-autofill-bg">
        <label
          htmlFor="email"
          className="font-title text-[10px] text-left leading-[1.4] tracking-[0.4px]"
        >
          {t('mailSubtitle')}
        </label>

        <input
          className="block text-main-xs w-full outline-none"
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          onBlur={handleLocalValidate}
        />

        {errorMessage && (
          <p className="absolute top-12 text-main-xs text-red-500">{errorMessage}</p>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="absolute top-14 right-2 text-main-xs text-green-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
          >
            ✅ Success submit!
          </motion.div>
        )}
      </AnimatePresence>

      <SubmitArrow islocalError={!!localError} />
    </form>
  );
};

export default MailForm;
