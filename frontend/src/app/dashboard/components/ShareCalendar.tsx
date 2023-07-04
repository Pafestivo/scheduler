import React from 'react'
import BookingUrl from './BookingUrl';
import TabSettings from './TabSettings';

function ShareCalendar() {
  const COMPONENTS = [
    {
      name: 'Booking URL',
      component: <BookingUrl />,
    },
  ];
  return <TabSettings components={COMPONENTS} />;
}

export default ShareCalendar