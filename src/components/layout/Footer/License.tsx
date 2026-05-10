import { Link } from '@/i18n/navigation';

const License = () => {
  const START_YEAR = 2024;
  const CURRENT_YEAR = String(new Date().getFullYear());

  return (
    <div className="flex justify-between items-center flex-col md:flex-row font-extra text-[10px] ">
      <p className="flex-1 mb-2 md:mb-0 text-center md:text-start">
        © <time dateTime={String(START_YEAR)}>{START_YEAR}</time>-
        <time dateTime={CURRENT_YEAR}>{CURRENT_YEAR}</time> ECHOCODE. ALL RIGHTS RESERVED.
      </p>
      <Link
        href="/privacy-policy"
        className="w-fit mx-auto mb-2 md:mb-0 uppercase underline text-center 
        transition-colors duration-main hover:text-accent focus-visible:text-accent"
      >
        Privacy Policy
      </Link>
      <p className="flex-1 text-center md:text-end">
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
