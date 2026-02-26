import { Project } from '../types/projects';

const platformFilter = (list: Project[], platform?: string) => {
  if (!platform) return list;

  const lowerPlatform = platform.toLowerCase();

  return list.filter((item) => item.platforms.some((p) => p.toLowerCase() === lowerPlatform));
};

const listQueries = (str: string | undefined) => {
  return str ? str?.split(',').filter(Boolean) : [];
};

const categoriesFilter = (list: Project[], selectedCategories: string[]) => {
  if (!selectedCategories?.length) return list;

  const lowerSelected = selectedCategories.map((c) => c.toLowerCase());

  return list.filter((project) =>
    project.categories?.some((category) => lowerSelected.includes(category.toLowerCase())),
  );
};

export { platformFilter, categoriesFilter, listQueries };
