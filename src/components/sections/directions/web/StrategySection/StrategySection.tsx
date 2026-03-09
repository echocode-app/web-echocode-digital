import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsBlock from './MetricsBlock';

const StrategySection = () => {
  return (
    <section className="pt-10 pb-10 md:pb-27.5">
      <SectionContainer>
        <div className="flex items-start justify-between flex-col lg:flex-row">
          <div className="max-w-100 md:max-w-150 lg:max-w-120 mb-10 lg:mb-0">
            <SectionTitle marginBottom="10px">
              EXPERTISE <span className="text-[12px] md:text-[18px]">&</span> STRATEGY
            </SectionTitle>
            <p className=" text-main-xs md:text-main-sm">
              Every line of code is a business asset. We focus on architectural integrity to
              minimize technical debt and maximize ROI.
            </p>
          </div>
          <MetricsBlock />
        </div>
      </SectionContainer>
    </section>
  );
};

export default StrategySection;
