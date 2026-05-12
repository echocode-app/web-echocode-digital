import FooterNavigation from './FooterNavigation';

import License from './License';

import FooterFormWrapper from './FooterFormWrapper.';

const Footer = () => {
  return (
    <footer className="pt-10 md:pt-13 pb-6 border-t border-accent overflow-hidden">
      <div className="max-w-318.5 mx-auto px-4 md:px-8 ">
        <FooterFormWrapper />
        <FooterNavigation />
        <License />
      </div>
    </footer>
  );
};

export default Footer;
