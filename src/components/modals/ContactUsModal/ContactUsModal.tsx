'use client';

import Link from 'next/link';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import ContactUsForm from './ContactUsForm';
import CloseBtn from './ContactUsForm/CloseBtn';
import { consumeContactModalReturnPath } from './contactModal.navigation';
import SectionTitle from '@/components/UI/section/SectionTitle';
import type { SubmitState } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';

const ContactUsModal = () => {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const isClosingBlocked = submitState === 'loading';

  const navigateWithRestore = useCallback((target: string, scrollY = 0) => {
    const restoreScroll = () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
      });
    };

    router.replace(target, { scroll: false });
    router.refresh();
    window.setTimeout(restoreScroll, 0);

    // Fallback for intercepted-route edge cases where modal slot may stay mounted.
    window.setTimeout(() => {
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (currentPath !== target) {
        router.replace(target, { scroll: false });
        window.setTimeout(restoreScroll, 50);
      }
    }, 220);
  }, [router]);

  const resolveCloseTarget = useCallback(() => consumeContactModalReturnPath(), []);

  const closeModal = useCallback(() => {
    if (isClosingBlocked) return;
    const returnState = resolveCloseTarget();
    const target = returnState?.path ?? '/';
    const scrollY = returnState?.scrollY ?? 0;

    if (returnState) {
      window.history.back();
      window.setTimeout(() => {
        if (window.location.pathname.startsWith('/contact')) {
          navigateWithRestore(target, scrollY);
        }
      }, 180);
      return;
    }

    navigateWithRestore(target, scrollY);
  }, [isClosingBlocked, navigateWithRestore, resolveCloseTarget]);

  const closeOnSuccess = useCallback(() => {
    const returnState = resolveCloseTarget();
    const target = returnState?.path ?? '/';
    const scrollY = returnState?.scrollY ?? 0;

    if (returnState) {
      window.history.back();
      window.setTimeout(() => {
        if (window.location.pathname.startsWith('/contact')) {
          navigateWithRestore(target, scrollY);
        }
      }, 180);
      return;
    }

    navigateWithRestore(target, scrollY);
  }, [navigateWithRestore, resolveCloseTarget]);

  const navigateToSuccess = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.history.replaceState(window.history.state, '', '/contact/success');
  }, []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeModal]);

  return (
    <motion.div
      onClick={isClosingBlocked ? undefined : closeModal}
      className="fixed inset-0 z-200 flex items-center justify-center
         bg-black/50 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="px-4 md:px-8 max-w-280 w-full">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative  w-full flex flex-col mx-auto p-5 pt-10 md:pt-15 md:pb-6 md:px-5 lg:p-15 lg:pb-8
           rounded-secondary border bg-[rgba(0,0,0,0.8)] border-white backdrop-blur-[26px]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute top-1 right-2 md:top-4 md:right-4">
            <CloseBtn onClose={closeModal} disabled={isClosingBlocked} />
          </div>
          <div className=" md:mb-2.5">
            <SectionTitle>GOT A PROJECT IN MIND?</SectionTitle>
          </div>
          <div className="flex flex-wrap md:gap-1 text-main-sm mb-2 md:mb-8">
            <p className="text-white">
              Get professional advice. Use the form or write us an email:
            </p>
            <Link href={'mailto:hello@echocode.app'} className="font-semibold text-accent">
              hello@echocode.app
            </Link>
          </div>
          <ContactUsForm
            onSuccessNavigate={navigateToSuccess}
            onAutoClose={closeOnSuccess}
            onSubmitStateChange={setSubmitState}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUsModal;
