import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DominationImage from './DominationImage';
import DominateList from './DominateList';

const DominationSection = () => {
  const t = useTranslations('IGamingPage.DominateSection');

  return (
    <section className="pb-10">
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className="text-main-sm mb-12">{t('desc')} </p>
        <ul className="w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-0 justify-between mb-17.5">
          <li className="w-full max-w-120">
            <DominationImage image="/images/directions/igaming/before.png" desc="Before" />
          </li>
          <li className="w-full max-w-120">
            <DominationImage
              image="/images/directions/igaming/after.png"
              desc="After"
              gradient={true}
            />
          </li>
        </ul>
        <DominateList />
      </SectionContainer>
    </section>
  );
};

export default DominationSection;
