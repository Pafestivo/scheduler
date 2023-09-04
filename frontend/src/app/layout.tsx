import { Inter } from 'next/font/google';
import { NextAuthProvider } from '../components/Provider';
import '../styles/normalize.css';
import { GlobalContextProvider, useGlobalContext } from './context/store';
import Navbar from '@/components/Navbar';
import AlertBar from '@/components/AlertSnackbar';
import Head from 'next/head';
import GlobalSpinner from '@/components/GlobalSpinner';
import I18nMiddleware from '@/components/I18nMiddleware';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WeSchedule',
  description: 'Schedule your workload',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <NextAuthProvider>
          <GlobalContextProvider>
            <I18nMiddleware />
            <Navbar />
            {children}
            <AlertBar />
            <GlobalSpinner />
          </GlobalContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}