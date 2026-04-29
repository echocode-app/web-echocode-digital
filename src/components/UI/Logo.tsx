import Image from 'next/image';

const Logo = () => {
  return (
    <div className="relative w-12 h-12 md:w-14 md:h-14">
      <Image src="/UI/logo.png" alt="Echocode Digital logo" fill sizes="(min-width: 768px) 56px, 48px" />
    </div>
  );
};

export default Logo;
