import Link from 'next/link';
import { useTranslations } from 'next-intl';

const OrderLink = () => {
  const t = useTranslations('HomePage.HeroSection');

  return (
    <Link
      href="/contact"
      scroll={false}
      className="block mx-auto w-fit px-4 py-2 
     font-title text-[8px] font-bold rounded-lg bg-accent cursor-pointer
     md:text-title-xs md:px-6 md:rounded-base uppercase"
    >
      {t('orderButton')}
    </Link>
  );
};

export default OrderLink;
