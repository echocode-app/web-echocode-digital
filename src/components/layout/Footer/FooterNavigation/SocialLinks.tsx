import Image from 'next/image';
import Link from 'next/link';

const SocailLinks = () => {
  return (
    <ul className="flex justify-center gap-2 lg:justify-end">
      <li>
        <Link
          href={'https://t.me/echocode_app'}
          target="blank"
          className="flex justify-center items-center w-10 h-10 bg-base-gray rounded-full 
          hover:bg-accent duration-main"
        >
          <div className="relative w-4.5 h-3.5">
            <Image src="/UI/social-icons/telegram.svg" fill alt="Telegram" />
          </div>
        </Link>
      </li>
      <li>
        <Link
          href={'http://instagram.com/echocode.app'}
          target="blank"
          className="flex justify-center items-center w-10 h-10 bg-base-gray rounded-full
          hover:bg-accent duration-main"
        >
          <div className="relative w-4.5 h-4.5">
            <Image src="/UI/social-icons/insta.svg" fill alt="Instagram" />
          </div>
        </Link>
      </li>
    </ul>
  );
};

export default SocailLinks;
