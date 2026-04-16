'use client';

import Link from 'next/link';

const LinksList = () => {
  return (
    <ul>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 bg-gray75 rounded-full" />
        <Link
          href={'https://developers.google.com/admob/terms'}
          target="blank"
          rel="noopener noreferrer"
          className="underline"
          onClick={(e) => e.stopPropagation()}
        >
          AdMob
        </Link>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 bg-gray75 rounded-full" />
        <Link
          href={'https://www.revenuecat.com/terms'}
          target="blank"
          rel="noopener noreferrer"
          className="underline"
          onClick={(e) => e.stopPropagation()}
        >
          RevenueCat
        </Link>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 bg-gray75 rounded-full" />
        <Link
          href={'https://surfshark.com/privacy'}
          target="blank"
          rel="noopener noreferrer"
          className="underline"
          onClick={(e) => e.stopPropagation()}
        >
          Surfshark
        </Link>
      </li>
    </ul>
  );
};

export default LinksList;
