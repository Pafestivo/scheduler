import React from 'react';
import TabSettings from './TabSettings';
import GoogleIntegration from './GoogleIntegration';
import OutlookIntegration from './OutlookIntegration';

const IntegrationSettings = () => {
  const COMPONENTS = [
    {
      name: 'Google',
      component: <GoogleIntegration />,
    },
    {
      name: 'Outlook',
      component: <OutlookIntegration />,
    }
  ];
  return <TabSettings components={COMPONENTS} />;
};

export default IntegrationSettings;
