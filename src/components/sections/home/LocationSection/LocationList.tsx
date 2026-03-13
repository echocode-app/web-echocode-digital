import { useTranslations } from 'next-intl';

import LocationImage from './LocationImage';

const { kyiv, berlin, global } = {
  kyiv: 'bg-[linear-gradient(90deg,#F07F73_0%,#F6C27A_45%,#8B5CF6_100%)]',
  berlin: 'bg-[linear-gradient(90deg,#7C63E6_0%,#B63FAF_55%,#FF0A78_100%)]',
  global: 'bg-[linear-gradient(90deg,#FF4D73_0%,#F37A7C_35%,#F2A36D_70%,#F1C98A_100%)]',
};

const LocationList = () => {
  const t = useTranslations('HomePage.LocationsSection');

  return (
    <ul className="flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-start gap-10">
      <li className="w-full max-w-76.5 h-50">
        <LocationImage image="/images/locations/kyiv.png" title="ПривIт" gradient={kyiv} />
        <h3 className="font-title text-title-sm uppercase">{t('locations.kyiv')}</h3>
      </li>
      <li className="w-full max-w-76.5 h-50">
        <LocationImage image="/images/locations/berlin.png" title="Guten Tag" gradient={berlin} />
        <h3 className="font-title text-title-sm uppercase">{t('locations.berlin')}</h3>
      </li>
      <li className="w-full max-w-76.5 h-50">
        <LocationImage image="/images/locations/remote.jpg" title="global" gradient={global} />
        <h3 className="font-title text-title-sm uppercase">{t('locations.remote')}</h3>
      </li>
    </ul>
  );
};

export default LocationList;
