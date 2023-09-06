import React from 'react';
import FormQuestions from './FormQuestions';
import AfterBooking from './AfterBooking';
import TabSettings from './TabSettings';
import { useGlobalContext } from '@/app/context/store';

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  'Questions': 'Questions',
  'After Booking Message': 'After Booking Message',
};

const BookingSettings = ({
    hasUnsavedChanges,
    setHasUnsavedChanges 
  } : {  
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  }) => {

  const { translations } = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;
  
  const COMPONENTS = [
    {
      name: t('Questions'),
      component: <FormQuestions setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t('After Booking Message'),
      component: <AfterBooking setHasUnsavedChanges={setHasUnsavedChanges} />,
    }
  ];
  return <TabSettings hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} components={COMPONENTS} />;
};

export default BookingSettings;
