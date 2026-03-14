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

  const canHover = !isDisable && !pending && !success && !error;

  const buttonText = pending
    ? 'Submitting...'
    : success
      ? t('submitBtn')
      : error
        ? 'Try again'
        : t('submitBtn');

  const buttonColor = success ? 'bg-[#34C759]' : 'bg-main-gradient';
  const isDisabled = isDisable || pending || success ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      disabled={isDisable || pending || success}
      type="submit"
      className={`
        ${buttonColor} ${isDisabled}
        relative overflow-hidden w-full py-2.5 px-6 font-title rounded-base text-[10px] 
        uppercase font-bold transition-all duration-500 z-0 
        
        after:content-[''] after:absolute after:inset-0 after:bg-accent after:opacity-0 
        after:transition-opacity after:duration-500 after:-z-10
      ${
        canHover
          ? 'hover:after:opacity-100 hover:shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]'
          : ''
      } 
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {success && <Image src={'/UI/check.svg'} alt="Check" width={16} height={18} />}
        {buttonText}
      </span>
    </button>
  );
};

export default SubmitBtn;
