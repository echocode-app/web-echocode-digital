import Image from 'next/image';

const NotFound = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16">
      <div>
        <h3 className="font-title text-title-2xl mb-2"> No open positions</h3>
        <p className="max-w-90 mb-4  text-left text-main-sm md:text-main-base text-gray75">
          We’re not hiring right now, but new opportunities may open soon.
        </p>
      </div>
      <div className="w-65.5 h-65.5 relative">
        <Image
          src="/images/rabbits/error.png"
          alt="No projects found"
          fill
          className="object-contain "
        />
      </div>
    </div>
  );
};

export default NotFound;
