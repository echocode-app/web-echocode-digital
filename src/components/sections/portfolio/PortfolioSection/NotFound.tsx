import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  const t = useTranslations('PortfolioError');

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 pt-14">
      <div>
        <h3 className="font-title text-title-2xl mb-2 uppercase">{t('title')}</h3>
        <p className="mb-4 text-center md:text-left text-main-sm md:text-main-base text-gray75">
          {t('description')}
        </p>
        <Link
          href={'/portfolio'}
          scroll={false}
          className="block px-4 py-2 mx-auto md:mx-0 w-fit text-title-xs font-title bg-accent rounded-secondary
           hover:bg-accent/90 duration-main uppercase"
        >
          {t('resetButton')}
        </Link>
      </div>
      <div className="w-65.5 h-65.5 relative">
        <Image
          src="/images/rabbits/error.png"
          alt="No projects found"
          fill
          className="object-contain "
        />
      </div>
    </div>
  );
};

export default NotFound;
