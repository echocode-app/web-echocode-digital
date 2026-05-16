'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  initAttachmentUpload,
  submitClientProject,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.api';
import { trackClientProjectModalEvent } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.analytics';
import {
  createInitialValues,
  SUCCESS_AUTO_CLOSE_MS,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
import type {
  FieldName,
  FormErrors,
  FormValues,
  SubmitState,
  UploadedImagePayload,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';
import {
  validateAll,
  validateField,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.validation';

export type { SubmitState };

function resolveSubmitErrorKey(status: number): string {
  if (status === 403) return 'form.turnstileFailed';
  if (status === 429) return 'form.rateLimit';
  if (status === 503) return 'form.serviceUnavailable';

  return 'form.submitFailed';
}

export function useClientProjectForm(
  onSuccessNavigate: () => void,
  onAutoClose: () => void,
  onSubmitStateChange?: (state: SubmitState) => void,
) {
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
    void trackClientProjectModalEvent('contact_modal_open');
  }, []);

  useEffect(() => {
    if (submitState !== 'success') return;

    onSuccessNavigate();

    const timer = window.setTimeout(() => {
      onAutoClose();
    }, SUCCESS_AUTO_CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [onAutoClose, onSuccessNavigate, submitState]);

  useEffect(() => {
    onSubmitStateChange?.(submitState);
  }, [onSubmitStateChange, submitState]);

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
      setErrors({ form: 'form.turnstileRequired' });
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

      const response = await submitClientProject(
        values,
        imagePayload,
        turnstileToken,
        'client_project_modal',
      );

      if (!response.ok) {
        void trackClientProjectModalEvent('submit_project_error', {
          stage: 'submit_response',
          status: response.status,
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
      });
      setErrors({ form: 'form.networkFailed' });
      setSubmitState('idle');
      resetTurnstile();
    }
  };

  const onClearPhoneWithoutValidation = () => {
    setValues((prev) => ({
      ...prev,
      phone: '',
    }));
  };

  return {
    values,
    errors,
    submitState,
    isLocked,
    turnstileKey,
    onSubmit,
    onChangeText,
    onChangeImage,
    onBlurField,
    onClearPhoneWithoutValidation,
    onTurnstileVerify,
    onTurnstileError,
  };
}
