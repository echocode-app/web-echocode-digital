import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';

const FeaturesCleanning = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10 text-[#E3E4E6]">
          <SectionTitle>Main Features of the Project</SectionTitle>
        </div>
        <div className="flex flex-wrap justify-center  items-end gap-6">
          <div className="flex flex-col gap-3 max-w-122 w-full">
            <h3 className="font-title text-[#E3E4E6]">Admin Panel:</h3>

            <div className="p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
              Manage orders and user data
            </div>
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            Track key metrics and dashboards
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            Edit pricing and services
          </div>

          <div className="max-w-122 w-full p-3 bg-gray9 rounded-secondary text-[#E3E4E6]">
            Moderate reviews
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default FeaturesCleanning;
