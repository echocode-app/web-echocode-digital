import { useTranslations } from 'next-intl';

import { SubmitStatus } from './types/candidate';
import Image from 'next/image';

interface SubmitBtnProps {
  isDisable: boolean;
  status: SubmitStatus;
}

const SubmitBtn = ({ isDisable, status }: SubmitBtnProps) => {
  const t = useTranslations('VacancyCommon.vacancyForm');

  const pending = status === 'pending';
  const success = status === 'success';
  const error = status === 'error';

  const buttonText = pending
    ? 'Submitting...'
    : success
      ? t('submitBtn')
      : error
        ? 'Try again'
        : t('submitBtn');

  const buttonColor = status === 'success' ? 'bg-[#34C759]' : 'bg-main-gradient';
  const isDisabled = isDisable || pending || success ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      disabled={isDisable}
      type="submit"
      className={`${buttonColor} ${isDisabled}
     relative  w-full py-2.5 px-6 font-title rounded-base text-[10px] uppercase font-bold 
       transition-colors duration-500`}
    >
      {status === 'success' && (
        <Image
          src={'/UI/check.svg'}
          alt="Check"
          width={16}
          height={18}
          className="absolute top-1/2 left-[calc(50%-110px)] -translate-y-1/2"
        />
      )}
      {buttonText}
    </button>
  );
};

export default SubmitBtn;
