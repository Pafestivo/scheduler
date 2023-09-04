'use client';
import { useEffect } from 'react';
import { useGlobalContext } from './context/store';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { user, translations } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [router, user]);

  interface EnglishFallbackType {
    [key: string]: string;
  }
  
  const englishFallback: EnglishFallbackType = {
    'welcome': 'Welcome to cortex',
    'welcomeUser': 'Welcome, {user}',
    'redirecting': 'Redirecting to your dashboard',
    'workInProgress': 'This page is a work in progress, but you can still use our application!',
    'clickToRegister': 'Click the user icon in the top right to register or login',
  };
  
  // Helper function to get the translation
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;  
  
  return (
    <div>
      <h1>{t('welcome')} {user?.name ? `${t('welcomeUser').replace('{user}', user.name)}` : ''}</h1>
      <div>
        {user?.name ? (
          <h1>{t('redirecting')}</h1>
        ) : (
          <div>
            <p>{t('workInProgress')}</p>
            <p>{t('clickToRegister')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
