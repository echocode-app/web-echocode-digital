import SectionContainer from '@/components/UI/section/SectionContainer';
import PortfolioFilter from './Filter/PlatformFilter';
import ProjectList from './Projects/ProjectList';

import staticProjects from '@/data/portfolio/static-project-list.json';

import { categoriesFilter, listQueries, platformFilter } from './utils/filters';

import ProjectPreviewList from './Projects/ProjectPreviewList';
import NotFound from './NotFound';

import { listPublicPortfolioProjects, PortfolioPreviewProjectItem } from '@/server/portfolio';

interface PortfolioSectionProps {
  projectsFilter: { categories?: string; platform?: string };
}

const PortfolioSection = async ({ projectsFilter }: PortfolioSectionProps) => {
  const { platform, categories } = projectsFilter;
  const previewProjects = await listPublicPortfolioProjects();

  let filteredStaticProjects: PortfolioPreviewProjectItem[] =
    staticProjects as PortfolioPreviewProjectItem[];
  let filteredProjects: PortfolioPreviewProjectItem[] = previewProjects;

  filteredStaticProjects = platformFilter(filteredStaticProjects, platform);
  filteredStaticProjects = categoriesFilter(filteredStaticProjects, listQueries(categories));

  filteredProjects = platformFilter(filteredProjects, platform);
  filteredProjects = categoriesFilter(filteredProjects, listQueries(categories));

  return (
    <section className="pt-9 pb-10 md:pb-11">
      <SectionContainer>
        <PortfolioFilter />
        {filteredStaticProjects.length === 0 && filteredProjects.length === 0 ? (
          <NotFound />
        ) : (
          <>
            {filteredStaticProjects.length > 0 && <ProjectList list={filteredStaticProjects} />}

            {filteredProjects.length > 0 && (
              <div className="pt-5">
                <div className="bg-section-gradient-animated w-full h-px max-w-250 mx-auto mb-6" />
                <ProjectPreviewList list={filteredProjects} />
              </div>
            )}
          </>
        )}
      </SectionContainer>
    </section>
  );
};

export default PortfolioSection;
