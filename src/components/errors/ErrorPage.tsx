import { useLocale } from 'next-intl';
import Image from 'next/image';

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
}

const ErrorPage = ({ code, title, description }: ErrorPageProps) => {
  const locale = useLocale();
  const uaStyle =
    locale === 'ua'
      ? ' text-[16px] sm:text-[18px] md:text-[32px]'
      : ' text-[18px] sm:text-[22px] md:text-[40px]';

  return (
    <section className="relative pt-57 pb-25 lg:pt-27.5 lg:pb-0 overflow-hidden">
      <div className="max-w-270.5 w-full mx-auto px-8 flex items-center ">
        <div>
          <h1
            className="mb-3 text-[28px] leading-6.5 sm:text-[50px] sm:leading-11.5 md:text-[80px]
             font-bold tracking-[6px] md:tracking-[14px] md:leading-20 md:w-137.5"
          >
            {code}-error
          </h1>
          <p
            className={`mb-6 max-w-[320px] md:max-w-137.5 lg:max-w-full
           ${uaStyle} font-semibold tracking-[2px] uppercase`}
          >
            {title}
          </p>
          <p
            className="max-w-[320px] lg:max-w-142.5 text-[14px]
             md:text-[18px] text-[#A1A1AA]"
          >
            {description}
          </p>
        </div>
        <div className="relative hidden lg:block z-40 w-100 h-150">
          <div
            className="hidden lg:block absolute top-50% left-1/2
           -translate-x-70 -translate-y-22.5 w-165 h-165
            -z-10 pointer-events-none"
          >
            <Image src="/UI/backgrounds/error-bg.svg" alt="Error" fill priority className="" />
          </div>
          <Image
            src={'/images/rabbits/error.png'}
            alt="Rabbit"
            fill
            priority
            className="z-10 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
