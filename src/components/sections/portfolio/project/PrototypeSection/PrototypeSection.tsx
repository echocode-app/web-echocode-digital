import { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProptotypeSectionProps {
  leftBgImage: string;
  rightBgImage: string;
  translateKey: string;
  children: ReactNode;
}

const ProptotypeSection = ({
  leftBgImage,
  rightBgImage,
  translateKey,
  children,
}: ProptotypeSectionProps) => {
  const t = useTranslations(translateKey);

  return (
    <section className="pb-10">
      <div className="mb-6 mx-auto max-w-172.5">
        <h2 className="px-4 text-center block text-title-2xl md:text-title-4xl font-title uppercase">
          {t('title')}
        </h2>
      </div>
      <p className="px-4 text-center font-title text-title-sm uppercase font-bold">
        {t('subtitle')}
      </p>
      <div className="pt-20 relative flex justify-between gap-80 items-center min-h-160">
        <div className="absolute top-0 left-0 w-full h-24 md:h-40 bg-linear-to-b from-black to-transparent z-20" />
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-40 bg-linear-to-t from-black to-transparent z-20" />

        <div className="hidden md:block relative w-160 h-160">
          <Image src={leftBgImage} alt="Background" fill className="object-cover w-full h-full" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-y-[calc(50%-10px)] -translate-x-[calc(50%+4px)] overflow-hidden z-30">
          <div className="relative shrink-0 w-69 h-144.25">
            <div className="absolute top-1/2 left-1/2 -translate-y-[calc(50%-10px)] -translate-x-[calc(50%-6px)]">
              {children}
            </div>
          </div>
        </div>
        <div className="hidden md:block relative w-160 h-160">
          <Image src={rightBgImage} alt="Background" fill className="object-cover w-full h-full" />
        </div>
      </div>
    </section>
  );
};

export default ProptotypeSection;
