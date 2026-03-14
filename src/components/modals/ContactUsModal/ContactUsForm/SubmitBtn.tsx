import { useTranslations } from 'next-intl';

import type { SubmitState } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';

type SubmitBtnProps = {
  state: SubmitState;
};

const SubmitBtn = ({ state }: SubmitBtnProps) => {
  const t = useTranslations('ProjectModal.projectForm');

  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isDisabled = isLoading || isSuccess;
  const canHover = !isDisabled;

  return (
    <div>
      <button
        type="submit"
        disabled={isDisabled}
        className={`relative z-0 block w-full overflow-hidden rounded-secondary py-3 font-title text-title-base text-white shadow-button transition-all duration-500 md:py-4 ${
          isSuccess
            ? 'cursor-default bg-[#39c65c]'
            : `bg-main-gradient ${
                canHover
                  ? 'cursor-pointer after:absolute after:inset-0 after:-z-10 after:bg-accent after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 hover:shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)] focus-visible:after:opacity-100 focus-visible:shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]'
                  : 'cursor-not-allowed disabled:opacity-90'
              }`
        }`}
      >
        <span
          className={`relative z-10 items-center justify-center gap-2 ${isLoading ? 'inline-flex' : 'hidden'} uppercase`}
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white uppercase" />
          {t('submitSending')}
        </span>
        <span className={`relative z-10 ${isLoading ? 'hidden' : 'inline'} uppercase`}>
          {isSuccess ? t('successBtn') : t('submitBtn')}
        </span>
      </button>
    </div>
  );
};

export default SubmitBtn;
