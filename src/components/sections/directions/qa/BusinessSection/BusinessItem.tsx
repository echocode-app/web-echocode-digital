import { useLocale } from 'next-intl';

interface BusinessItem {
  title: string;
  active: boolean;
}

const BusinessItem = ({ title, active }: BusinessItem) => {
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? '' : 'max-w-47.5';

  return (
    <p
      className={`${uaStyle} w-full font-bold uppercase font-title px-3 border-l border-accent duration-main
    ${active ? 'text-accent' : 'text-white'}
    `}
    >
      {title}
    </p>
  );
};

export default BusinessItem;
