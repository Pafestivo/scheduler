import React from 'react';
import FormQuestions from './FormQuestions';
import AfterBooking from './AfterBooking';
import TabSettings from './TabSettings';

const BookingSettings = ({
    hasUnsavedChanges,
    setHasUnsavedChanges 
  } : {  
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
  }) => {
  const COMPONENTS = [
    {
      name: 'Questions',
      component: <FormQuestions setHasUnsavedChanges={setHasUnsavedChanges} />,
    },
    {
      name: 'After Booking Message',
      component: <AfterBooking setHasUnsavedChanges={setHasUnsavedChanges} />,
    }
  ];
  return <TabSettings hasUnsavedChanges={hasUnsavedChanges} setHasUnsavedChanges={setHasUnsavedChanges} components={COMPONENTS} />;
};

export default BookingSettings;
