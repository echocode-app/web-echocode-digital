'use client';

import { useEffect, useMemo, useState } from 'react';
import { initAttachmentUpload, submitClientProject } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.api';
import { trackClientProjectModalEvent } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.analytics';
import {
  INITIAL_VALUES,
  SUCCESS_AUTO_CLOSE_MS,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.constants';
import type {
  FieldName,
  FormErrors,
  FormValues,
  SubmitState,
  UploadedImagePayload,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';
import { validateAll, validateField } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.validation';

export type { SubmitState };

export function useClientProjectForm(
  onSuccessNavigate: () => void,
  onAutoClose: () => void,
  onSubmitStateChange?: (state: SubmitState) => void,
) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const isLocked = submitState === 'loading' || submitState === 'success';

  const canSubmit = useMemo(() => !isLocked, [isLocked]);

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
        lastName: true,
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

  return {
    values,
    errors,
    submitState,
    isLocked,
    onSubmit,
    onChangeText,
    onChangeImage,
    onBlurField,
  };
}
