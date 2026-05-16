'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import SubmitBtn from './SubmitBtn';
import initUpload from './actions/initUpload';
import { VacancyData } from '../../types/vacancy';
import { uploadFile } from './actions/uploadFile';
import { submitCandidate } from './actions/sendCandidate';
import { CandidateSubmissionPayload, InitUploadResult, SubmitStatus } from './types/candidate';
import {
  candidateSubmitSchema,
  profileUrlSchema,
  uploadFileBaseSchema,
} from './schemas/candidate-schema';
import TurnstileWidget from '@/widgets/TurnstileWidget';

interface CandidateFormProps {
  vacancyData: VacancyData;
}

interface FormErrors {
  profileUrl?: string;
  cvFile?: string;
  form?: string;
}

function resolveCandidateSubmitErrorKey(error: unknown): string {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('403')) return 'form.turnstileFailed';
  if (message.includes('429')) return 'form.rateLimit';
  if (message.includes('503')) return 'form.serviceUnavailable';

  return 'form.submitFailed';
}

const CandidateForm = ({ vacancyData }: CandidateFormProps) => {
  const t = useTranslations('VacancyCommon.vacancyForm');
  const errorsT = useTranslations('VacancyValidation');

  const translateError = (key?: string) => (key ? errorsT(key) : undefined);

  const locale = useLocale();
  const ukStyle = locale === 'uk' ? 'text-main-xs' : 'text-main-sm';

  const fileRef = useRef<HTMLInputElement>(null);
  const profileUrlRef = useRef<HTMLInputElement>(null);

  const [cvFile, setCvFile] = useState<InitUploadResult | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const resetTurnstile = () => {
    setTurnstileToken('');
    setTurnstileKey((prev) => prev + 1);
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    setErrors((prev) => ({
      ...prev,
      form: undefined,
    }));
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken('');
    setErrors((prev) => ({
      ...prev,
      form: 'form.turnstileUnavailable',
    }));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileErrors([]);
    setCvFile(null);

    const fileData = {
      path: '',
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    };

    const parsed = uploadFileBaseSchema.safeParse(fileData);
    if (!parsed.success) {
      const errors = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];
      setFileErrors(errors);
      return;
    }

    setUploadingFile(true);
    setErrors((prev) => ({ ...prev, cvFile: undefined }));
    try {
      const uploadData = await initUpload(file);
      await uploadFile(file, uploadData);
      setCvFile(uploadData);
      setErrors((prev) => ({ ...prev, cvFile: undefined }));
    } catch (err) {
      console.error(err);
      setCvFile(null);
      setFileErrors(['file.uploadFailed']);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileUrl = profileUrlRef.current?.value.trim() || '';

    const parsed = candidateSubmitSchema.safeParse({
      profileUrl,
      cvFile: cvFile
        ? {
            path: cvFile.path,
            originalName: cvFile.originalName.trim(),
            mimeType: cvFile.mimeType,
            sizeBytes: cvFile.sizeBytes,
          }
        : undefined,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        profileUrl: fieldErrors.profileUrl?.[0],
        cvFile: fieldErrors.cvFile?.[0],
      });
      return;
    }

    const payload: CandidateSubmissionPayload = {
      profileUrl,
      cvFile: parsed.data.cvFile!,
      vacancy: {
        vacancyId: vacancyData.vacancyId || vacancyData.vacancySlug || 'unknown',
        ...(vacancyData.vacancySlug && { vacancySlug: vacancyData.vacancySlug }),
        ...(vacancyData.vacancyTitle && { vacancyTitle: vacancyData.vacancyTitle }),
        ...(vacancyData.level && { level: vacancyData.level }),
        ...(vacancyData.conditions &&
          vacancyData.conditions.length > 0 && { conditions: vacancyData.conditions }),
        ...(vacancyData.employmentType && { employmentType: vacancyData.employmentType }),
      },
    };

    if (!turnstileToken) {
      setErrors((prev) => ({
        ...prev,
        form: 'form.turnstileRequired',
      }));
      return;
    }

    setSubmitStatus('pending');
    setErrors({});

    try {
      await submitCandidate(payload, turnstileToken);
      setSubmitStatus('success');
      resetTurnstile();
      timeoutRef.current = setTimeout(() => {
        setSubmitStatus('idle');
        setCvFile(null);
        setFileErrors([]);
        setErrors({});

        if (profileUrlRef.current) profileUrlRef.current.value = '';
        if (fileRef.current) fileRef.current.value = '';
      }, 5000);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        form: resolveCandidateSubmitErrorKey(err),
      }));
      setSubmitStatus('error');
      resetTurnstile();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-149.5 w-full">
      <strong className="block mb-2 text-main-sm font-medium">{t('subtitle')}</strong>
      <div className="mb-5">
        <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="
            relative flex flex-col gap-1 py-2 pl-4 pr-6 w-full text-left
            border rounded-secondary leading-3.5
            hover:border-accent focus:border-accent duration-main
            outline-0 text-[10px] placeholder:text-white
            border-white cursor-pointer"
        >
          <p className="font-title uppercase font-bold">{t('cvLabel')}</p>
          <div className=" flex gap-1 items-center">
            <Image src="/UI/clip.svg" alt="Clip" width={12} height={16} />
            <span className={`block text-primary-gray text-main-xs leading-4 ${ukStyle}`}>
              {uploadingFile ? 'uploading...' : cvFile?.originalName || t('cvPlaceholder')}
            </span>
          </div>
          {(fileErrors.length > 0 || errors.cvFile) && (
            <p className="absolute top-13 left-4 text-red-500 text-[10px]">
              {translateError(fileErrors[0]) || translateError(errors.cvFile)}
            </p>
          )}
        </button>
      </div>
      <div className="relative mb-5">
        <Image
          src="/UI/chain.svg"
          alt="Link"
          width={14}
          height={16}
          className="absolute top-7 left-4"
        />
        <label
          htmlFor="profileUrl"
          className="absolute top-2 left-4 pointer-events-none text-[10px] font-title
           text-white uppercase font-bold"
        >
          {t('linkLabel')}
        </label>
        <input
          ref={profileUrlRef}
          type="text"
          name="profileUrl"
          placeholder={t('linkPlaceholder')}
          className="
            indent-4 block pt-6.5 pb-2 pl-4 pr-6
            border rounded-secondary leading-4 w-full
            hover:border-accent focus:border-accent
            duration-main transition-colors
            outline-0 text-main-xs font-main text-white
            placeholder:text-primary-gray border-white
          "
          onChange={() => {
            setErrors((prev) => ({ ...prev, profileUrl: undefined }));
          }}
          onBlur={() => {
            const value = profileUrlRef.current?.value.trim() || '';
            const parsed = profileUrlSchema.safeParse(value);

            if (!parsed.success) {
              setErrors((prev) => ({
                ...prev,
                profileUrl: parsed.error.issues[0].message,
              }));
            } else {
              setErrors((prev) => ({
                ...prev,
                profileUrl: undefined,
              }));
            }
          }}
        />
        {errors.profileUrl && (
          <p className="absolute top-12.5 left-4 text-red-500 text-[10px] mt-1">
            {translateError(errors.profileUrl)}
          </p>
        )}
      </div>
      <div className=" mb-4 flex min-h-[71.5px] w-full justify-center">
        <TurnstileWidget
          key={turnstileKey}
          action="vacancy-submission"
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
        />
      </div>
      <div className="relative">
        <div className="absolute -top-4 left-0" aria-live="polite">
          <p
            className={`text-red-500 text-[10px] transition-opacity duration-main ${
              errors.form ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {translateError(errors.form) ?? ' '}
          </p>
        </div>
        <SubmitBtn status={submitStatus} isDisable={uploadingFile} />
      </div>
    </form>
  );
};

export default CandidateForm;
