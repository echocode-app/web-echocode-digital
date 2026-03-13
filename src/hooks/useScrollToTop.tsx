import { usePathname } from 'next/navigation';

export const useScrollToTop = (currentPath: string) => {
  const pathname = usePathname();

  return () => {
    if (pathname === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
};
