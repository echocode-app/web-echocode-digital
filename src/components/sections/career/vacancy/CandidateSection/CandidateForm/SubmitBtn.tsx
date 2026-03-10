import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';

const SubmitBtn = () => {
  const t = useTranslations('VacancyCommon.vacancyForm');
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full py-2.5 px-6 font-title bg-main-gradient rounded-base text-[10px] cursor-pointer uppercase font-bold"
    >
      {pending ? 'Pending' : t('submitBtn')}
    </button>
  );
};

export default SubmitBtn;
