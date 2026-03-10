import { useLocale } from 'next-intl';

interface BusinessItem {
  title: string;
}

const BusinessItem = ({ title }: BusinessItem) => {
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? '' : 'max-w-47.5';

  return (
    <p className={`${uaStyle} w-full font-bold uppercase font-title px-3 border-l border-accent`}>
      {title}
    </p>
  );
};

export default BusinessItem;
