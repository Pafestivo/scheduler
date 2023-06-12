import { Calendar } from '@prisma/client';
import React from 'react';

const BookingSettings = ({
  calendar,
  setCalendar,
}: {
  calendar: Calendar | null;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
}) => {
  return <div>BookingSettings</div>;
};

export default BookingSettings;
