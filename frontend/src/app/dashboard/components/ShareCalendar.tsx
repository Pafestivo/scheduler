import React from 'react'
import BookingUrl from './BookingUrl';
import TabSettings from './TabSettings';
import { useGlobalContext } from '@/app/context/store';

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  "Booking URL": "Booking URL",
};

function ShareCalendar() {

  const { translations } = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;
  
  const COMPONENTS = [
    {
      name: t('Booking URL'),
      component: <BookingUrl />,
    },
  ];
  return <TabSettings components={COMPONENTS} />;
}

export default ShareCalendar