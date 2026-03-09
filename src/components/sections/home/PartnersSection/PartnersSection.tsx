import Image from 'next/image';
import { useTranslations } from 'next-intl';

import partners from '@/data/partners.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import PartnersList from './PartnerList';

const PartnersSection = () => {
  const t = useTranslations('HomePage.PartnersSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="2" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <div className="relative flex items-center py-19.25 h-70 w-full overflow-hidden">
          <Image
            src={'/UI/backgrounds/partners-bg.png'}
            fill
            alt="Partners"
            className="object-cover rounded-secondary"
          />
          <PartnersList list={partners} />
        </div>
      </SectionContainer>
    </section>
  );
};

export default PartnersSection;
