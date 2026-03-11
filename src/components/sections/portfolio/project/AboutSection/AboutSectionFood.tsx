import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';

const AboutSectionFood = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0 mb-3">
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">About a Project</h3>
            <p className="text-main-sm text-gray75">
              Food & Drinks is a mobile application developed for a nationwide restaurant chain to
              enhance customer engagement and streamline the food ordering experience. The app
              offers users a visually rich and intuitive interface to browse the menu, discover
              seasonal offers, and participate in the brand’s loyalty program — all via their
              smartphone. It integrates geolocation, multichannel notifications (push, email, SMS),
              and QR code scanning for seamless in-store and digital interaction.
            </p>
          </div>
          <div className="flex justify-center w-36.5 md:w-98.5 lg:pl-15.5 lg:pr-16">
            <div className="relative w-36.5 h-86.5 overflow-visible">
              <Image
                src="/images/projects/right-phone.png"
                alt="right-phone"
                fill
                className="object-contain rotate-22"
              />

              <Image
                src="/images/projects/food/right-screen.png"
                alt="screen"
                fill
                className="absolute z-10 object-cover scale-104 -translate-x-1 -translate-y-0.5 overflow-visible"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-0">
          <div className="flex justify-center w-36.5 md:w-98.5 lg:h-59 lg:pl-12.5 lg:pr-19.5 order-1 lg:order-0">
            <div className="relative w-36.5 h-86.5 overflow-visible">
              <Image
                src={'/images/projects/left-phone.png'}
                alt="left-phone"
                fill
                className="-rotate-22 absolute lg:-translate-y-30"
              />
              <Image
                src="/images/projects/food/left-screen.png"
                alt="screen"
                fill
                className="absolute z-10 object-cover scale-104 translate-x-1 -translate-y-0.5 lg:-translate-y-30.5 overflow-visible"
              />
            </div>
          </div>
          <div className="p-3 max-w-141.5">
            <h3 className="mb-3 font-title">Project Idea</h3>
            <p className="mb-0.5  text-main-sm text-gray75">
              {
                " The client's vision was to create a modern, scalable food-ordering solution that would:"
              }
            </p>
            <ul className="flex flex-col gap-0.5 text-main-sm text-gray75">
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Provide a full digital menu with
                intuitive navigation
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> ESupport loyalty point tracking
                and personalized offers
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Enable seasonal promotions and
                campaign updates
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Integrate QR functionality for
                in-store engagement
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" /> Deliver timely notifications via
                multiple channels
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default AboutSectionFood;
