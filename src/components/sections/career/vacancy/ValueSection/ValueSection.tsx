import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';

interface ValueSectionProps {
  title: string;
  subtitle: string;
  translateKey: string;
}

const ValueSection = ({ title, subtitle, translateKey }: ValueSectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pt-10 pb-10 md:pb-27">
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t(title)}</SectionTitle>
        <p className="text-main-sm">{t(subtitle)}</p>
      </SectionContainer>
    </section>
  );
};

export default ValueSection;
