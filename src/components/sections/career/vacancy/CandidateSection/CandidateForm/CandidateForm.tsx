'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import SubmitBtn from './SubmitBtn';

// import { submitApplication } from './actions/sendCandidate';
import initUpload, { InitUploadResult } from './actions/initUpload';
// import { uploadFile } from './actions/uploadFile';

import { VacancyData } from '../../types/vacancy';
import { useLocale, useTranslations } from 'next-intl';

// const initialState = {
//   success: false,
//   errors: {},
// };

interface CandidateFormProps {
  vacancyData: VacancyData;
}

const CandidateForm = ({ vacancyData }: CandidateFormProps) => {
  const t = useTranslations('VacancyCommon.vacancyForm');
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? 'text-main-xs' : 'text-main-sm';

  console.log(vacancyData);
  // const { vacancyId, vacancySlug, vacancyTitle, level, conditions, employmentType } = vacancyData;

  // const [state, formAction] = useActionState(submitApplication, initialState);

  const inputRef = useRef<HTMLInputElement>(null);

  // const [path, setPath] = useState('');
  const [cvFile, setCvFile] = useState<InitUploadResult>();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = await initUpload(file);
      console.log(uploadData);
      // await uploadFile(file, uploadUrl);

      // setPath(path);
      setCvFile(uploadData);
    } catch (err) {
      console.error(err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="max-w-149.5 w-full">
      {/* <input type="hidden" name="cvFile" value={JSON.stringify(cvFileObject)} /> */}
      <input type="hidden" name="vacancy" value={JSON.stringify(vacancyData)} />
      {/* <input type="text" name="profileUrl" value={profileUrl} /> */}
      <strong className="block mb-2 text-main-sm font-medium">{t('subtitle')}</strong>
      <div className="mb-4">
        <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative
                   flex flex-col gap-1 py-2 pl-4 pr-6 w-full text-left border rounded-secondary leading-3.5 
                   hover:border-accent focus:border-accent duration-main
                 outline-0 text-[10px]  placeholder:text-white 
                  border-white cursor-pointer
                  "
        >
          <p className="font-title uppercase font-bold">{t('cvLabel')}</p>
          <div className="flex gap-1">
            <Image src={'/UI/clip.svg'} alt="Clip" width={12} height={16} />
            <span className={`block text-primary-gray text-main-sm leading-4 ${uaStyle}`}>
              {uploading ? 'Uploading...' : cvFile?.originalName || t('cvPlaceholder')}
            </span>
          </div>
        </button>
      </div>
      <div className="relative mb-4">
        <Image
          src={'/UI/chain.svg'}
          alt="Clip"
          width={14}
          height={16}
          className="absolute top-7 left-4"
        />
        <label
          htmlFor="profileUrl"
          className=" absolute top-2 left-4
               pointer-events-none text-[10px] font-title text-white border-white uppercase font-bold"
        >
          {t('linkLabel')}
        </label>
        <input
          type="text"
          name="profileUrl"
          placeholder={t('linkPlaceholder')}
          className="indent-4 block pt-6.5 pb-2 pl-4 pr-6 border rounded-secondary leading-4 w-full
         hover:border-accent focus:border-accent duration-main transition-colors
       outline-0 text-main-xs font-main text-white placeholder:text-primary-gray border-white"
        />
        {/* {state?.errors?.profileUrl && (
          <p className="text-red-500 text-sm">{state.errors.profileUrl[0]}</p>
        )} */}
      </div>
      <SubmitBtn />
      {/* {state?.success && <p className="text-green-500 mt-2">Application sent successfully</p>} */}
    </form>
  );
};

export default CandidateForm;
