'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import directions from '@/data/directions/directions.json';
import DirectionItem from './DirectionItem';

const DirectionList = () => {
  const [isShowLastItems, setIsShowLastItems] = useState(false);
  const t = useTranslations('HomePage.DirectionsSection');

  return (
    <>
      <ul className="flex flex-col gap-10 mb-10">
        {directions.slice(0, 3).map((item) => (
          <li key={item.id}>
            <DirectionItem {...item} />
          </li>
        ))}

        {isShowLastItems &&
          directions.slice(-2).map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <DirectionItem {...item} />
            </motion.li>
          ))}
      </ul>
      {!isShowLastItems && (
        <button
          onClick={() => setIsShowLastItems(true)}
          className="block mx-auto md:mx-0 md:ml-auto px-6 py-2 font-title text-title-sm 
      rounded-base border-2 border-accent shadow-button
       hover:bg-accent duration-main cursor-pointer uppercase"
        >
          {t('loadMoreBtn')}
        </button>
      )}
    </>
  );
};

export default DirectionList;
