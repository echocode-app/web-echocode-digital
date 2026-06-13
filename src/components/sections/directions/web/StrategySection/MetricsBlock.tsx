import { useLocale, useTranslations } from 'next-intl';
import Counter from './Counter';

const MetricsBlock = () => {
  const t = useTranslations('WebPage.StrategySection');
  const locale = useLocale();
  const uaStyle = locale === 'uk' ? 'text-main-sm text-[15px]' : '';
  const enStyle = locale === 'en' ? 'text-title-xs' : 'text-title-sm leading-[16px]';
  const deStyle = locale === 'de' ? 'sm:max-w-30' : 'sm:max-w-24';

  return (
    <div className="flex flex-col gap-6 w-full h-full max-w-120 mx-auto lg:mx-0">
      <ul className={`flex flex-wrap gap-1 lg:gap-3 max-w-120 ${uaStyle}`}>
        <li className="flex items-center gap-2 px-1 md:px-0.5 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-white before:content-['']">
          {t('points.point01')}
        </li>
        <li className="flex items-center gap-2 px-1 md:px-0.5 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-white before:content-['']">
          {t('points.point02')}
        </li>
        <li className="flex items-center gap-2 px-1 md:px-0.5 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-white before:content-['']">
          {t('points.point03')}
        </li>
        <li className="flex items-center gap-2 px-1 md:px-0.5 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-white before:content-['']">
          {t('points.point04')}
        </li>
      </ul>
      <ul className="flex gap-6 w-full flex-col sm:flex-row">
        <li
          className={`w-full sm:max-w-57 p-3  ${enStyle} rounded-secondary border-2 border-accent`}
        >
          <h3 className="mb-3 sm:max-w-27 font-title text-accent uppercase">{t('list.list01')}</h3>
          <div className="flex items-center">
            <div className="w-14.5">
              <Counter to={250} />
            </div>
            <span className="font-wadik text-[20px] leading-7.5">+</span>
          </div>
        </li>
        <li
          className={`w-full sm:max-w-57 p-3 ${enStyle}  rounded-secondary border-2 border-accent`}
        >
          <h3 className={`mb-3 ${deStyle} font-title text-accent uppercase`}>{t('list.list02')}</h3>
          <div className="flex items-center">
            <div className="w-16.5">
              <Counter to={99.9} decimals={1} />
            </div>
            <span className="flex items-center text-[20px] align-text-top leading-5.5">%</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MetricsBlock;
