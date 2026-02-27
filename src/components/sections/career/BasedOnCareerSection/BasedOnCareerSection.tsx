import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import BasedOnCareerList from './BasedOnCareerList';

const BasedOnCareerSection = () => {
  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="max-w-155 mb-2.5">
          <SectionTitle>Don׳t just write code. Build businesses</SectionTitle>
        </div>
        <p className="text-main-sm mb-10">
          Here you become a product engineer, not just a task executor. Your code directly impacts
          the revenue and experience of millions of users.
        </p>
        <BasedOnCareerList />
      </SectionContainer>
    </section>
  );
};

export default BasedOnCareerSection;
