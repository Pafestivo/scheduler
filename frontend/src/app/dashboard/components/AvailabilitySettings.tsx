import React from 'react';
import TabSettings from './TabSettings';
import Availability from './Availability';
import Duration from './Duration';
import Timezone from './Timezone';

const AvailabilitySettings = ({ 
  hasUnsavedChanges,
  setHasUnsavedChanges,
} : { 
  hasUnsavedChanges: boolean,
  setHasUnsavedChanges: (hasChanges: boolean) => void 
}) => {

  const COMPONENTS = [
    {
      name: 'Availability',
      component: <Availability setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: 'Duration & Breaks',
      component: <Duration setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: 'Timezone',
      component: <Timezone />,
    },
  ];
  return <TabSettings hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} components={COMPONENTS} />;
};

export default AvailabilitySettings;
