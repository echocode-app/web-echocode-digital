import { Poppins, Inter, Rubik } from 'next/font/google';
import localFont from 'next/font/local';

export const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export const rubik = Rubik({
  variable: '--font-rubik',
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '800'],
  subsets: ['latin'],
});

export const wadik = localFont({
  src: './Wadik.otf',
  variable: '--font-wadik',
  display: 'swap',
  weight: '700',
});
