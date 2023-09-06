import React from 'react';
import TabSettings from './TabSettings';
import GoogleIntegration from './GoogleIntegration';
import OutlookIntegration from './OutlookIntegration';
import { useGlobalContext } from '@/app/context/store';

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  "Google": "Google",
  "Outlook": "Outlook",
};

const IntegrationSettings = () => {
  const { translations } = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;

  const COMPONENTS = [
    {
      name: t('Google'),
      component: <GoogleIntegration />,
    },
    {
      name: t('Outlook'),
      component: <OutlookIntegration />,
    }
  ];
  return <TabSettings components={COMPONENTS} />;
};

export default IntegrationSettings;
