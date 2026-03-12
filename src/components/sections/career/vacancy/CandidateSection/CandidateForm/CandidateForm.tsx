'use client';

import { useRef, useState } from 'react';
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

interface CandidateFormProps {
  vacancyData: VacancyData;
}

interface FormErrors {
  profileUrl?: string;
  cvFile?: string;
}

const CandidateForm = ({ vacancyData }: CandidateFormProps) => {
  const t = useTranslations('VacancyCommon.vacancyForm');
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? 'text-main-xs' : 'text-main-sm';

  const fileRef = useRef<HTMLInputElement>(null);
  const profileUrlRef = useRef<HTMLInputElement>(null);

  const [cvFile, setCvFile] = useState<InitUploadResult | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      setFileErrors(['File upload failed']);
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

    setSubmitStatus('pending');
    setErrors({});

    try {
      await submitCandidate(payload);
      setSubmitStatus('success');

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
      setSubmitStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-149.5 w-full">
      <strong className="block mb-2 text-main-sm font-medium">{t('subtitle')}</strong>
      <div className="mb-4">
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
            <span className={`block text-primary-gray text-main-xs leading-4 ${uaStyle}`}>
              {uploadingFile ? 'uploading...' : cvFile?.originalName || t('cvPlaceholder')}
            </span>
          </div>
          {(fileErrors.length > 0 || errors.cvFile) && (
            <p className="absolute top-12.5 left-4 text-red-500 text-[10px]">
              {fileErrors[0] || errors.cvFile}
            </p>
          )}
        </button>
      </div>
      <div className="relative mb-4">
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
          <p className="absolute top-11.75 left-4 text-red-500 text-[10px] mt-1">
            {errors.profileUrl}
          </p>
        )}
      </div>
      <SubmitBtn status={submitStatus} isDisable={uploadingFile} />
    </form>
  );
};

export default CandidateForm;
