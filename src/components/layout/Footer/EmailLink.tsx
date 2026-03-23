import Link from 'next/link';

const EmailLink = () => {
  return (
    <Link
      href="mailto:hello@echocode.digital"
      className="block text-center mx-auto mb-4 lg:mb-0 font-wadik text-title-base text-base-gray uppercase
      hover:text-accent duration-main"
    >
      hello<span className="text-[9px]">@</span>echocode.digital
    </Link>
  );
};

export default EmailLink;
