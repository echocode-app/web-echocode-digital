import { useTranslations } from 'next-intl';

interface MetricsItemProps {
  title: string;
  desc: string;
}

const MetricsItem = ({ title, desc }: MetricsItemProps) => {
  const t = useTranslations('QAPage.MetricsSection.list');

  return (
    <li className="max-w-57">
      <h3 className="font-title mb-3 uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75">{t(desc)}</p>
    </li>
  );
};

export default MetricsItem;
