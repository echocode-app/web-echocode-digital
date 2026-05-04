import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n/navigation';

import FilterCategoriesItem from './FilterCategoriesItem';

import categories from '@/data/portfolio/filter/categories.json';

const FilterCategories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategories = (searchParams.get('categories')?.split(',') || []).filter(Boolean);

  const toggleCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const selected = (searchParams.get('categories')?.split(',') || []).filter(Boolean);

    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    if (updated.length) {
      params.set('categories', updated.join(','));
    } else {
      params.delete('categories');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ul className=" flex flex-wrap gap-3.5 p-3 backdrop-blur-[50px] bg-black15 rounded-secondary border border-gray10">
      {categories.map((item) => (
        <FilterCategoriesItem
          key={item.value}
          title={item.title}
          active={selectedCategories.includes(item.value)}
          onClick={() => toggleCategory(item.value)}
        />
      ))}
    </ul>
  );
};

export default FilterCategories;
