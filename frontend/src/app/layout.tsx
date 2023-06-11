import { Inter } from 'next/font/google';
import { NextAuthProvider } from '../components/Provider';
import '../styles/normalize.css';
import { GlobalContextProvider } from './context/store';
import Navbar from '@/components/Navbar';
import AlertBar from '@/components/AlertSnackbar';
import GlobalSpinner from '@/components/GlobalSpinner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WeSchedule',
  description: 'Schedule your workload',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
            <GlobalSpinner />
          </GlobalContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
