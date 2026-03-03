import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';

const AboutSectionCleaning = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0 mb-3">
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">About a Project</h3>
            <p className="text-main-sm text-gray75">
              Cleaning Service is a native iOS application developed for a cleaning company that
              connects customers with professional cleaners. The app allows clients to schedule
              cleaning services, manage payments securely, and communicate directly with cleaners.
              An admin panel supports full management of users, services, orders, and performance
              metrics.
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

              <Image
                src="/images/projects/e-commers/right-screen.png"
                alt="screen"
                fill
                className="absolute z-10 object-cover scale-104 -translate-x-1 -translate-y-0.5 overflow-visible"
              />
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
              <Image
                src="/images/projects/e-commers/left-screen.png"
                alt="screen"
                fill
                className="absolute z-10 object-cover scale-104 translate-x-1 -translate-y-0.5 lg:-translate-y-30.5 overflow-visible"
              />
            </div>
          </div>
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">Project Idea</h3>

            <ul className="flex flex-col gap-0.5 text-main-sm text-gray75">
              <li className="mb-px">
                The goal was to create a two-sided platform simplifying the booking process for
                customers and workload management for cleaners.
              </li>
              <li className="mb-6">
                From the customer perspective, the app enables quick service requests with
                transparent pricing and reliable reviews.
              </li>
              <li>
                From the cleaner’s side, it offers a steady flow of orders, flexible scheduling, and
                direct communication with clients.
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default AboutSectionCleaning;
