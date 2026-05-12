'use client';

import { useLocale, useTranslations } from 'next-intl';

import ContactInput from '@/components/modals/ContactUsModal/ContactUsForm/ContactInput';
import ContactFile from '@/components/modals/ContactUsModal/ContactUsForm/ContactFile';
import YourNeedsInput from '@/components/modals/ContactUsModal/ContactUsForm/YourNeedInput';
import { useEffect, useMemo, useState } from 'react';
import { createInitialValues } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
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
import SubmitBtn from '@/components/modals/ContactUsModal/ContactUsForm/SubmitBtn';

const CommonFooterForm = () => {
  const formErrorT = useTranslations('ProjectValidation');
  const t = useTranslations('ProjectModal.projectForm');

  const locale = useLocale();
  const [values, setValues] = useState<FormValues>(() => createInitialValues(locale));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const isLocked = submitState === 'loading' || submitState === 'success';

  const canSubmit = useMemo(() => !isLocked, [isLocked]);

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

    setSubmitState('loading');
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      void trackClientProjectModalEvent('submit_project_attempt', { stage: 'before_submit' });
      let imagePayload: UploadedImagePayload | undefined;

      if (values.image) {
        imagePayload = await initAttachmentUpload(values.image);
      }

      const response = await submitClientProject(values, imagePayload);

      if (!response.ok) {
        void trackClientProjectModalEvent('submit_project_error', {
          stage: 'submit_response',
          status: response.status,
        });

        if (response.status === 429) {
          setErrors({ form: 'Too many requests. Please wait a bit and try again.' });
        } else {
          setErrors({ form: 'Submission failed. Please try again.' });
        }
        setSubmitState('idle');
        return;
      }

      setErrors({});
      setSubmitState('success');
    } catch (error) {
      void trackClientProjectModalEvent('submit_project_error', {
        stage: 'submit',
        message: error instanceof Error ? error.message : 'unknown_error',
      });
      setErrors({
        form:
          error instanceof Error && error.message
            ? error.message
            : 'Submission failed. Please check your connection and try again.',
      });
      setSubmitState('idle');
    }
  };

  const translateError = (key?: string) => (key ? formErrorT(key) : undefined);

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
        <ContactInput
          name="phone"
          label={t('phonePlaceholder')}
          value={values.phone}
          error={translateError(errors.phone)}
          autoComplete="tel-national"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('phone')}
          onChange={(value) => onChangeText('phone', value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 mb-6 md:mb-8">
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
        <ContactFile
          file={values.image}
          error={translateError(errors.image)}
          disabled={isLocked}
          onBlur={() => onBlurField('image')}
          onChange={onChangeImage}
        />
      </div>
      <div className="mb-4 md:mb-8">
        <YourNeedsInput
          value={values.description}
          error={translateError(errors.description)}
          disabled={isLocked}
          onBlur={() => onBlurField('description')}
          onChange={(value) => onChangeText('description', value)}
        />
      </div>
      <div className="absolute min-h-5 mb-1" aria-live="polite">
        <p
          className={`text-main-xs text-[#ff8d8d] transition-opacity duration-main ${errors.form ? 'opacity-100' : 'opacity-0'}`}
        >
          {errors.form ?? ' '}
        </p>
      </div>
      <SubmitBtn state={submitState} />
    </form>
  );
};

export default CommonFooterForm;
