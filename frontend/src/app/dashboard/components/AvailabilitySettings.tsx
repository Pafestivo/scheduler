import React from 'react';
import TabSettings from './TabSettings';
import Availability from './Availability';
import Duration from './Duration';
import Timezone from './Timezone';
import { useGlobalContext } from '@/app/context/store';

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  "Availability": "Availability",
  "Duration & Breaks": "Duration & Breaks",
  "Timezone": "Timezone",
};

const AvailabilitySettings = ({ 
  hasUnsavedChanges,
  setHasUnsavedChanges,
} : { 
  hasUnsavedChanges: boolean,
  setHasUnsavedChanges: (hasChanges: boolean) => void 
}) => {

  const { translations } = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;
  const COMPONENTS = [
    {
      name: t('Availability'),
      component: <Availability setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t('Duration & Breaks'),
      component: <Duration setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: t('Timezone'),
      component: <Timezone />,
    },
  ];
  return <TabSettings hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} components={COMPONENTS} />;
};

export default AvailabilitySettings;
