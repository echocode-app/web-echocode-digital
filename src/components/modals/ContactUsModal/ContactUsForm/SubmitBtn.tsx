import type { SubmitState } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';

type SubmitBtnProps = {
  state: SubmitState;
};

const SubmitBtn = ({ state }: SubmitBtnProps) => {
  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isDisabled = isLoading || isSuccess;

  return (
    <div>
      <button
        type="submit"
        disabled={isDisabled}
        className={`relative block w-full rounded-secondary py-3 font-title text-title-base text-white shadow-button transition duration-main md:py-4 ${
          isSuccess
            ? 'cursor-default bg-[#39c65c]'
            : 'cursor-pointer bg-main-gradient disabled:cursor-not-allowed disabled:opacity-90'
        }`}
      >
        <span className={`items-center justify-center gap-2 ${isLoading ? 'inline-flex' : 'hidden'}`}>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          Sending...
        </span>
        <span className={`${isLoading ? 'hidden' : 'inline'}`}>
          {isSuccess ? "REQUEST RECEIVED. WE'LL TALK SOON." : 'Send message'}
        </span>
      </button>
    </div>
  );
};

export default SubmitBtn;
