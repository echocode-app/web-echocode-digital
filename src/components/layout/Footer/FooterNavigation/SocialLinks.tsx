import Image from 'next/image';
import Link from 'next/link';

const SocailLinks = () => {
  return (
    <ul className="flex justify-center gap-2 lg:justify-end">
      <li>
        <Link
          href={'https://t.me/echocodeHQ'}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 rounded-full bg-social-telegram 
          hover:bg-accent focus-visible:bg-accent duration-main"
        >
          <div className="relative w-4.5 h-3.5">
            <Image src="/UI/social-icons/telegram.svg" fill alt="Telegram" />
          </div>
        </Link>
      </li>
      <li>
        <Link
          href={'https://wa.me/34683581566'}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 rounded-full bg-social-whatsapp 
          hover:bg-accent focus-visible:bg-accent duration-main"
        >
          <div className="relative w-5 h-5">
            <Image src="/UI/social-icons/whatsapp.svg" fill alt="WhatsApp" />
          </div>
        </Link>
      </li>
      <li>
        <Link
          href={'https://www.instagram.com/echocodeHQ'}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 rounded-full bg-social-instagram-link"
        >
          <div className="relative w-5 h-5">
            <Image src="/UI/social-icons/insta.svg" fill alt="Instagram" />
          </div>
        </Link>
      </li>
      <li>
        <Link
          href={'https://x.com/echocodeHQ'}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 rounded-full bg-black
         hover:bg-accent focus-visible:bg-accent duration-main"
        >
          <div className="relative w-4 h-4">
            <Image src="/UI/social-icons/x.svg" fill alt="X" />
          </div>
        </Link>
      </li>
      <li>
        <Link
          href={'https://www.tiktok.com/@echocode_digital'}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 rounded-full bg-black
         hover:bg-accent focus-visible:bg-accent duration-main"
        >
          <div className="relative w-5 h-5">
            <Image src="/UI/social-icons/tiktok.svg" fill alt="TikTok" />
          </div>
        </Link>
      </li>
    </ul>
  );
};

export default SocailLinks;
