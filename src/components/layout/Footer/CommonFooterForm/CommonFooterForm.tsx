'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ContactInput from '@/components/modals/ContactUsModal/ContactUsForm/ContactInput';
import ContactFile from '@/components/modals/ContactUsModal/ContactUsForm/ContactFile';
import YourNeedsInput from '@/components/modals/ContactUsModal/ContactUsForm/YourNeedInput';
import ContactInputNumber from '@/components/modals/ContactUsModal/ContactUsForm/ContactInputNumber';
import { createInitialValues } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
import SubmitBtn from '@/components/modals/ContactUsModal/ContactUsForm/SubmitBtn';
import {
  FieldName,
  FormErrors,
  FormValues,
  SubmitState,
  UploadedImagePayload,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';
import { trackClientProjectModalEvent } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.analytics';
import {
  initAttachmentUpload,
  submitClientProject,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.api';
import {
  validateAll,
  validateField,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.validation';
import TurnstileWidget from '@/widgets/TurnstileWidget';

function resolveSubmitErrorKey(status: number): string {
  if (status === 403) return 'form.turnstileFailed';
  if (status === 429) return 'form.rateLimit';
  if (status === 503) return 'form.serviceUnavailable';

  return 'form.submitFailed';
}

const CommonFooterForm = () => {
  const formErrorT = useTranslations('ProjectValidation');
  const t = useTranslations('ProjectModal.projectForm');

  const locale = useLocale();
  const [values, setValues] = useState<FormValues>(() => createInitialValues(locale));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const isLocked = submitState === 'loading' || submitState === 'success';

  const canSubmit = useMemo(() => !isLocked, [isLocked]);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('');
    setTurnstileKey((prev) => prev + 1);
  }, []);

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setErrors((prev) => ({
      ...prev,
      form: undefined,
    }));
  }, []);

  const onTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setErrors((prev) => ({
      ...prev,
      form: 'form.turnstileUnavailable',
    }));
  }, []);

  useEffect(() => {
    if (submitState !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setValues(createInitialValues(locale));
      setErrors({});
      setTouched({});
      setSubmitState('idle');
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [submitState, locale]);

  const onChangeText = (field: Exclude<FieldName, 'image'>, nextValue: string) => {
    setValues((prev) => {
      const nextValues = {
        ...prev,
        [field]: nextValue,
      };

      const fieldError = validateField(field, nextValues);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: touched[field] || prevErrors[field] ? fieldError : prevErrors[field],
        form: undefined,
      }));

      return nextValues;
    });
  };

  const onChangeImage = (file: File | null) => {
    setValues((prev) => {
      const nextValues = {
        ...prev,
        image: file,
      };

      const fieldError = validateField('image', nextValues);
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: touched.image || prevErrors.image ? fieldError : prevErrors.image,
        form: undefined,
      }));

      return nextValues;
    });
  };

  const onBlurField = (field: FieldName) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, values),
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const fieldErrors = validateAll(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setTouched({
        firstName: true,
        countryCode: true,
        phone: true,
        email: true,
        description: true,
        image: true,
      });
      return;
    }

    if (!turnstileToken) {
      setErrors((prev) => ({
        ...prev,
        form: 'form.turnstileRequired',
      }));
      return;
    }

    setSubmitState('loading');
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      void trackClientProjectModalEvent('submit_project_attempt', {
        stage: 'before_submit',
        source: 'client_project_footer',
      });
      let imagePayload: UploadedImagePayload | undefined;

      if (values.image) {
        imagePayload = await initAttachmentUpload(values.image);
      }

      const response = await submitClientProject(
        values,
        imagePayload,
        turnstileToken,
        'client_project_footer',
      );

      if (!response.ok) {
        void trackClientProjectModalEvent('submit_project_error', {
          stage: 'submit_response',
          status: response.status,
          source: 'client_project_footer',
        });

        resetTurnstile();

        setErrors({ form: resolveSubmitErrorKey(response.status) });
        setSubmitState('idle');
        return;
      }

      setErrors({});
      setSubmitState('success');
      resetTurnstile();
    } catch (error) {
      void trackClientProjectModalEvent('submit_project_error', {
        stage: 'submit',
        message: error instanceof Error ? error.message : 'unknown_error',
        source: 'client_project_footer',
      });
      setErrors({ form: 'form.networkFailed' });
      setSubmitState('idle');
      resetTurnstile();
    }
  };

  const translateError = (key?: string) => (key ? formErrorT(key) : undefined);

  const clearPhoneWithoutValidation = () => {
    setValues((prev) => ({
      ...prev,
      phone: '',
    }));
  };

  return (
    <form onSubmit={onSubmit} className="md:min-w-149 min-[1068]:max-w-149">
      <div className="flex flex-col md:flex-row gap-6 md:gap-6 mb-6 md:mb-8">
        <ContactInput
          name="firstName"
          label={t('firstNamePlaceholder')}
          value={values.firstName}
          error={translateError(errors.firstName)}
          autoComplete="given-name"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('firstName')}
          onChange={(value) => onChangeText('firstName', value)}
        />
        <ContactInputNumber
          name="phone"
          label={t('phonePlaceholder')}
          value={values.phone}
          countryCode={values.countryCode}
          locale={locale}
          error={translateError(errors.phone)}
          required
          disabled={isLocked}
          onBlur={() => onBlurField('phone')}
          onChange={(phone) => onChangeText('phone', phone)}
          onClearWithoutValidation={clearPhoneWithoutValidation}
          onCountryCodeChange={(countryCode) => onChangeText('countryCode', countryCode)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:gap-6 mb-6 md:mb-8">
        <ContactInput
          name="email"
          label={t('emailPlaceholder')}
          type="email"
          value={values.email}
          error={translateError(errors.email)}
          autoComplete="email"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('email')}
          onChange={(value) => onChangeText('email', value)}
        />
        {/* <ContactFile
          file={values.image}
          error={translateError(errors.image)}
          disabled={isLocked}
          onBlur={() => onBlurField('image')}
          onChange={onChangeImage}
        /> */}
      </div>
      <div className="mb-4">
        <YourNeedsInput
          value={values.description}
          error={translateError(errors.description)}
          disabled={isLocked}
          onBlur={() => onBlurField('description')}
          onChange={(value) => onChangeText('description', value)}
        />
      </div>
      <div className="mx-auto w-fit mb-4 min-h-[71.5px]">
        <TurnstileWidget
          key={turnstileKey}
          action="client-project"
          onVerify={onTurnstileVerify}
          onError={onTurnstileError}
        />
      </div>
      <div className="relative">
        <SubmitBtn state={submitState} />
        <div className="absolute left-0 min-h-5 mb-1 -top-5" aria-live="polite">
          <p
            className={`text-main-xs text-[#ff8d8d] transition-opacity duration-main ${errors.form ? 'opacity-100' : 'opacity-0'}`}
          >
            {translateError(errors.form) ?? ' '}
          </p>
        </div>
      </div>
    </form>
  );
};

export default CommonFooterForm;
