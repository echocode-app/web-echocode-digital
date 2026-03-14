'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import FilterItem from './PlatfotmFilterItem';
import ToggleBarBtn from './ToggleBarBtn';
import FilterCategories from './FilterCategories';

import buildQuery from '../utils/buildQuery';

const PlatformFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');

  return (
    <>
      <div
        className="mb-3 flex gap-4 flex-col min-[560px]:flex-row
       items-center justify-between p-3 mx-auto w-full rounded-secondary bg-gray16 backdrop-blur-[6px]"
      >
        <ul className="flex justify-between gap-2 sm:gap-3">
          <FilterItem link={buildQuery(searchParams, 'platform')} title="All" active={!platform} />
          <FilterItem
            title="IOS"
            link={buildQuery(searchParams, 'platform', 'ios')}
            active={platform === 'ios'}
          />
          <FilterItem
            title="Unity"
            link={buildQuery(searchParams, 'platform', 'unity')}
            active={platform === 'unity'}
          />
          <FilterItem
            title="Android"
            link={buildQuery(searchParams, 'platform', 'android')}
            active={platform === 'android'}
          />
          <FilterItem
            title="Web"
            link={buildQuery(searchParams, 'platform', 'web')}
            active={platform === 'web'}
          />
        </ul>
        <ToggleBarBtn setOpenCategories={setIsOpen} isOpen={isOpen} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <FilterCategories />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlatformFilter;
