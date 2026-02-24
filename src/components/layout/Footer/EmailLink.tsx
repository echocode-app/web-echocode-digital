import Link from 'next/link';

const EmailLink = () => {
  return (
    <Link
      href="mailto:hello@echocode.app"
      className="block w-65.5 mx-auto mb-4 lg:mb-0 font-title text-title-base text-base-gray uppercase
      hover:text-accent duration-main"
    >
      hello<span className="text-[9px] ">@</span>echocode.app
    </Link>
  );
};

export default EmailLink;
