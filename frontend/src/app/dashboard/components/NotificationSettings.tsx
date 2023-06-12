import { Calendar } from '@prisma/client';
import React from 'react';

const NotificationSettings = ({
  calendar,
  setCalendar,
}: {
  calendar: Calendar | null;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
}) => {
  return <div>NotificationSettings</div>;
};

export default NotificationSettings;
