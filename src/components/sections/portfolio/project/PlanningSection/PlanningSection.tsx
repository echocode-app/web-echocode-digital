import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import PlanningList from './PlanningList';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface PlanningSectionProps {
  list: { title: string; desc: string[] }[];
  image: string;
  imageStyle: string;
  translateKey: string;
}

const PlanningSection = ({ list, image, imageStyle, translateKey }: PlanningSectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-4">
          <div className={imageStyle}>
            <Image src={image} alt="Planning" fill className="object-cover rounded-secondary" />
          </div>
          <div>
            <SectionTitle marginBottom="24px">{t('title')}</SectionTitle>
            <PlanningList list={list} translateKey={translateKey} />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default PlanningSection;
