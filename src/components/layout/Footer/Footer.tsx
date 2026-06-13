import FooterNavigation from './FooterNavigation';

import License from './License';

import FooterFormWrapper from './FooterFormWrapper.';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative pt-10 md:pt-13 pb-6 border-t border-accent overflow-hidden">
      <div className="max-w-318.5 mx-auto px-4 md:px-8 ">
        <Image
          src={'/UI/backgrounds/footer-bg.svg'}
          width={800}
          height={1200}
          alt="Footer Background"
          className="absolute top-86 lg:top-110 left-1/2 -translate-1/2 -z-10"
        />
        <FooterFormWrapper />
        <FooterNavigation />
        <License />
      </div>
    </footer>
  );
};

export default Footer;
