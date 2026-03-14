import { ReactNode, Suspense } from 'react';

import PageViewTracker from '@/components/analytics/PageViewTracker';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroBackground from '@/components/UI/HeroBackground';
import ContactUsBtn from '@/components/modals/ContactUsModal/ContactUsBtn';

const PublicLayout = ({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) => {
  return (
    <>
      <div className="relative">
        <HeroBackground />
        <Header />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <main>{children}</main>
        {modal}
        <ContactUsBtn />
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;
