import type { Metadata } from 'next';
import { Bangers, Roboto } from 'next/font/google';
import StoreProvider from '@/store/StoreProvider';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers',
});

export const metadata: Metadata = {
  title: 'Rick & Morty Explorer',
  description: 'Browse and favorite Rick & Morty characters',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.variable} ${bangers.variable}`}>
      <body className={roboto.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
