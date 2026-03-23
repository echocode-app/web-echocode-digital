import { CareerData } from '../types/vacancy';
import qaData from '@/data/vacancy/qa.json';
import iosDevData from '@/data/vacancy/ios-dev.json';
import designerData from '@/data/vacancy/designer.json';

const handleStaticVacancy = (slug: string) => {
  const vacancyMap: Record<string, CareerData> = {
    qaengineer: qaData,
    iosdev: iosDevData,
    designer: designerData,
  };

  return vacancyMap[slug] ?? null;
};

export default handleStaticVacancy;
