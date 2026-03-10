import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface StepsItemProps {
  title: string;
}

const StepsItem = ({ title }: StepsItemProps) => {
  const t = useTranslations('TeamPage.StepsSection');

  return (
    <li className="flex gap-3 py-3">
      <div className="relative">
        <div className="absolute left-0 top-px">
          <Image src="/UI/check.svg" alt="Check" width={20} height={20} />
        </div>
        <h3 className="indent-7.5 font-title uppercase font-bold">{t(title)}</h3>
      </div>
    </li>
  );
};

export default StepsItem;
