import Link from 'next/link';

const License = () => {
  const START_YEAR = 2024;
  const CURRENT_YEAR = String(new Date().getFullYear());

  return (
    <div className="flex flex-col md:flex-row md:justify-between  font-extra text-[10px] ">
      <p className="mb-3 md:mb-0 text-center">
        ©{' '}
        <time dateTime={String(START_YEAR)}>{START_YEAR}</time>-<time dateTime={CURRENT_YEAR}>{CURRENT_YEAR}</time>{' '}
        ECHOCODE. ALL RIGHTS RESERVED.
      </p>
      <p className="text-center">
        <Link
          href="https://maps.google.com/?q=Kyiv+city+center"
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-main hover:text-accent focus-visible:text-accent"
        >
          KYIV
        </Link>{' '}
        |{' '}
        <Link
          href="https://maps.google.com/?q=Berlin+city+center"
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-main hover:text-accent focus-visible:text-accent"
        >
          BERLIN
        </Link>
      </p>
    </div>
  );
};

export default License;
