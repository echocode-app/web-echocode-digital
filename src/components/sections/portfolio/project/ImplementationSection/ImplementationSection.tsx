import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ImplementationList from './ImplementationList';
import { useTranslations } from 'next-intl';

interface ImplementationSectionProps {
  translateKey: string;
  subtitle: string;
  list: {
    title: string;
    subTitle: string;
    desc: string;
  }[];
}

const ImplementationSection = ({ subtitle, list, translateKey }: ImplementationSectionProps) => {
  const t = useTranslations('ImplementationECommerce');

  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className="text-main-sm mb-10">{subtitle}</p>
        <ImplementationList list={list} translateKey={translateKey} />
      </SectionContainer>
    </section>
  );
};

export default ImplementationSection;
