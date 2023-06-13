import React from 'react';
import FormQuestions from './FormQuestions';
import AfterBooking from './AfterBooking';
import TabSettings from './TabSettings';

const BookingSettings = () => {
  const COMPONENTS = [
    {
      name: 'Questions',
      component: <FormQuestions />,
    },
    {
      name: 'After Booking Message',
      component: <AfterBooking />,
    }
  ];
  return <TabSettings components={COMPONENTS} />;
};

export default BookingSettings;
