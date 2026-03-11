import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';

const AboutSectionECommerse = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0 mb-3">
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">About a Project</h3>
            <p className="text-main-sm text-gray75">
              E-commerce is a mobile shopping application designed for a multi-brand fashion
              retailer targeting women, men, and kids. The app delivers a modern, streamlined
              shopping experience — from browsing categories to placing secure orders — with an
              emphasis on speed, simplicity, and visual clarity. It includes user accounts,
              favorites, dynamic filtering, real-time shipping options, and analytics.
            </p>
          </div>
          <div className="flex justify-center w-36.5 md:w-98.5 lg:pl-15.5 lg:pr-16">
            <div className="relative w-36.5 h-86.5">
              <Image
                src="/images/projects/right-phone.png"
                alt="right-phone"
                fill
                className="object-contain rotate-[22.4deg]"
              />

              <div className="absolute -top-2.25 -left-16 w-66.5 h-90">
                <Image
                  src="/images/projects/e-commers/right-screen.png"
                  alt="screen"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0">
          <div className="flex justify-center w-36.5 md:w-98.5 lg:h-59 lg:pl-12.5 lg:pr-19.5 order-1 lg:order-0">
            <div className="relative w-36.5 h-86.5">
              <Image
                src={'/images/projects/left-phone.png'}
                alt="left-phone"
                fill
                className="-rotate-22 absolute lg:-translate-y-30"
              />
              <div className="absolute -top-2.25 -left-14 lg:-top-32.25 lg:-left-14 w-66.5 h-90">
                <Image
                  src="/images/projects/e-commers/left-screen.png"
                  alt="screen"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">Project Idea</h3>
            <p className="mb-0.5  text-main-sm text-gray75">
              The client aimed to create a flexible and scalable mobile platform where customers
              could:
            </p>
            <ul className="flex flex-col gap-0.5 text-main-sm text-gray75">
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Discover new fashion collections
                for all age groups
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Easily search, filter, and
                explore across brands and sizes
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Save favorite items and manage
                purchases in a few taps
              </li>
              <li className="flex gap-2 items-start">
                <div className="w-1 h-1 bg-gray75 rounded-full shrink-0 mt-2" />
                Enjoy a minimalistic, mobile-first interface that feels intuitive and engaging. The
                primary goal was to improve user engagement and drive mobile conversions.
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default AboutSectionECommerse;
