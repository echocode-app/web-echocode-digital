import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import CoreItem from './CoreItem';

const CoreSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">CORE SOLUTIONS</SectionTitle>
        <ul className="flex gap-6 justify-center flex-wrap">
          <CoreItem
            title={'ENTERPRISE SYSTEMS'}
            desc={
              'Bespoke ERP／CRM architectures designed for full business automation and data harmony.'
            }
          />
          <CoreItem
            title={'HIGH-LOAD PLATFORMS'}
            desc={
              'Engineering for millions of users with zero-downtime architecture and global performance.'
            }
          />
          <CoreItem
            title={'E-COMMERCE SOLUTIONS'}
            desc={
              'Scalable storefronts focusing on conversion rates and seamless multi-vendor integrations.'
            }
          />
        </ul>
      </SectionContainer>
    </section>
  );
};

export default CoreSection;
