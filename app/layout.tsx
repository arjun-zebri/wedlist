import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Wedding MCs Sydney | Professional Masters of Ceremony | WedList',
    template: '%s | WedList'
  },
  description: 'Find the perfect wedding MC in Sydney. Browse professional masters of ceremony, compare packages, and book the ideal MC for your special day.',
  keywords: ['wedding MC Sydney', 'master of ceremonies Sydney', 'wedding emcee Sydney', 'Sydney wedding MCs'],
  authors: [{ name: 'WedList' }],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://wedlist.com.au',
    siteName: 'WedList',
    title: 'Wedding MCs Sydney | Professional Masters of Ceremony',
    description: 'Find the perfect wedding MC in Sydney. Browse professional masters of ceremony, compare packages, and book the ideal MC for your special day.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding MCs Sydney | Professional Masters of Ceremony',
    description: 'Find the perfect wedding MC in Sydney. Browse professional masters of ceremony and book your ideal MC.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
