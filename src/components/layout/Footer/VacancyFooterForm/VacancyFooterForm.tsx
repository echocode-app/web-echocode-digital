'use client';

import { useCallback, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import SubmitArrow from './SubmitArrow';
import { submitEmail } from './api/submitEmail';
import { emailSchema } from './shemas/emailSchema';
// import TurnstileWidget from '@/widgets/TurnstileWidget';
import RecaptchaWidget from '@/widgets/RecaptchaWidget';

type FormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
};

const VacancyFooterForm = () => {
  const [state, setState] = useState<FormState>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // const [turnstileToken, setTurnstileToken] = useState('');
  // const [turnstileKey, setTurnstileKey] = useState(0);

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const locale = useLocale();

  const deEsLocale = locale === 'de' || locale === 'es' ? 'xl:max-w-120' : 'xl:max-w-150';

  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations('Layout.Footer');
  const errorsT = useTranslations('EmailSubmitValidation');

  // const resetTurnstile = useCallback(() => {
  //   setTurnstileToken('');
  //   setTurnstileKey((prev) => prev + 1);
  // }, []);

  // const handleTurnstileVerify = useCallback((token: string) => {
  //   setTurnstileToken(token);
  //   setLocalError(null);
  //   setState((prev) => ({
  //     ...prev,
  //     error: undefined,
  //   }));
  // }, []);

  // const handleTurnstileError = useCallback(() => {
  //   setTurnstileToken('');
  //   setState((prev) => ({
  //     ...prev,
  //     error: 'form.turnstileUnavailable',
  //   }));
  // }, []);

  const resetCaptcha = useCallback(() => {
    setCaptchaToken('');
    setCaptchaKey((prev) => prev + 1);
  }, []);

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
    setLocalError(null);
    setState((prev) => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken('');
    setState((prev) => ({
      ...prev,
      error: 'form.turnstileUnavailable',
    }));
  }, []);

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

    // if (!turnstileToken) {
    //   setState({ error: 'form.turnstileRequired' });
    //   return;
    // }

    if (!captchaToken) {
      setState({ error: 'form.turnstileRequired' });
      return;
    }

    setLocalError(null);

    // const response = await submitEmail(formData, turnstileToken);
    const response = await submitEmail(formData, captchaToken);
    setState(response);

    if (response.success) {
      formRef.current?.reset();
      setShowSuccess(true);
      // resetTurnstile();
      resetCaptcha();
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      // resetTurnstile();
      resetCaptcha();
    }
  };

  const errorMessage = localError
    ? errorsT(localError)
    : state.fieldErrors?.email?.[0]
      ? errorsT(state.fieldErrors.email[0])
      : state.error
        ? errorsT(state.error)
        : undefined;

  return (
    <div className={`${deEsLocale} w-full`}>
      <div className="mb-2 flex min-h-19.5 w-full justify-center">
        {/* <TurnstileWidget
          key={turnstileKey}
          action="email-submission"
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
        /> */}
        <RecaptchaWidget
          resetSignal={captchaKey}
          onVerify={handleCaptchaVerify}
          onError={handleCaptchaError}
        />
      </div>
      <strong className="block mb-2 font-medium leading-none text-[12px]">{t('mailTitle')}</strong>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative flex justify-between items-center gap-4 w-full pl-3.5 pr-6 py-2
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
            onChange={() => {
              setLocalError(null);
              if (state.fieldErrors?.email) {
                setState((prev) => ({
                  ...prev,
                  fieldErrors: { ...prev.fieldErrors, email: undefined },
                }));
              }
            }}
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
              {t('mailSuccess')}
            </motion.div>
          )}
        </AnimatePresence>
        <SubmitArrow islocalError={!!localError} />
      </form>
    </div>
  );
};

export default VacancyFooterForm;
