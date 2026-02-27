import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface DirectionItemProps {
  link: string;
  position: string;
  image: string;
  title: string;
  descriptionKey: string;
}

const DirectionItem = ({ position, image, title, descriptionKey, link }: DirectionItemProps) => {
  const t = useTranslations('HomePage.DirectionsSection');

  return (
    <Link
      href={link}
      className="relative flex flex-col sm:flex-row gap-4 cursor-pointer group 
    lg:before:content-[''] 
    lg:before:absolute lg:before:top-0 lg:before:right-0
    lg:before:bg-gray75 lg:before:h-px lg:before:w-6"
    >
      <div
        className="relative min-w-43 min-h-45 md:min-w-100 md:min-h-45 max-w-full
       overflow-hidden rounded-secondary"
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="420px"
          style={{ objectPosition: position }}
          className="object-cover transition-transform duration-main group-hover:scale-105
          will-change-transform"
        />
      </div>
      <div>
        <h3
          className="mb-2.5 font-wadik font-bold text-title-base md:text-title-2xl
         group-hover:text-accent duration-main uppercase"
        >
          {title}
        </h3>
        <p className="text-main-sm text-gray75">{t(descriptionKey)}</p>
      </div>
    </Link>
  );
};

export default DirectionItem;
