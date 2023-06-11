import { Inter } from 'next/font/google';
import { NextAuthProvider } from '../components/Provider';
import '../styles/normalize.css';
import { GlobalContextProvider } from './context/store';
import Navbar from '@/components/Navbar';
import AlertBar from '@/components/AlertSnackbar';
import Head from 'next/head';

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
            <Navbar />
            {/* <nav> */}
            {/* <Link href={'/'}>
            <p>Home</p>
            </Link>
            
            <Link href={'/login'}>
            <p>Login</p>
            </Link>
            
            <Link href={'/register'}>
            <p>Register for free</p>
            </Link>
          </nav> */}
            {children}
            <AlertBar />
          </GlobalContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
