'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { rememberContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';
import { CONTACT_BUTTON_SYNC_EVENT } from '@/components/layout/Footer/ContactUsFullBtn';

const ContactUsBtn = () => {
  const [isSyncedHover, setIsSyncedHover] = useState(false);

  useEffect(() => {
    const onSyncHover = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>;
      setIsSyncedHover(Boolean(customEvent.detail?.active));
    };

    window.addEventListener(CONTACT_BUTTON_SYNC_EVENT, onSyncHover as EventListener);

    return () => {
      window.removeEventListener(CONTACT_BUTTON_SYNC_EVENT, onSyncHover as EventListener);
    };
  }, []);

  return (
    <div
      className="fixed md:sticky bottom-50 md:translate-y-27.5 lg:translate-y-24.75 
  max-w-318.5 mx-auto w-full flex justify-end px-4 md:px-8 pointer-events-none z-100"
    >
      <div className="pointer-events-auto">
        <Link
          href="/contact"
          scroll={false}
          onClick={rememberContactModalReturnPath}
          className={`
        relative z-0 overflow-hidden
        w-14.5 h-14.5 rounded-full bg-accent 
        flex items-center justify-center cursor-pointer
        transition-all duration-500

        after:content-[''] after:absolute after:inset-0 
        after:bg-main-gradient after:opacity-0 after:rounded-full
        after:transition-opacity after:duration-500 after:-z-10

        hover:after:opacity-100 
        hover:shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]
        ${isSyncedHover ? 'after:opacity-100 shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]' : ''}
      `}
        >
          <div className="relative z-10 w-6.5 h-5.5">
            <Image src="/UI/contact.svg" alt="Contact Us" fill />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ContactUsBtn;
