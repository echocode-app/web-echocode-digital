import { useLocale, useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import TransparencyList from './TransparencyList';

const TransparencySection = () => {
  const t = useTranslations('TeamPage.TransparencySection');
  const locale = useLocale();
  const ukStyle = locale === 'uk' ? 'text-[16px]' : 'text-[20px]';

  return (
    <section className="pb-10 md:pb-0">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="4px">{t('title')}</SectionTitle>
        <p className={`mb-8 ${ukStyle} `}>{t('subtitle')}</p>
        <TransparencyList />
      </SectionContainer>
    </section>
  );
};

export default TransparencySection;
