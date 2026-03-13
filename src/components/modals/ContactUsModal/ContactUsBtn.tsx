'use client';

import Image from 'next/image';
import Link from 'next/link';

import { rememberContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';

const ContactUsBtn = () => {
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
          className="w-14.5 h-14.5 rounded-full bg-accent 
                       shadow-lg flex items-center justify-center cursor-pointer"
        >
          <div className="relative w-6.5 h-5.5">
            <Image src="/UI/contact.svg" alt="Contact Us" fill />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ContactUsBtn;
