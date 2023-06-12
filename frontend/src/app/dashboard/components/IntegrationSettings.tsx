import { Calendar } from '@prisma/client';
import React from 'react';

const IntegrationSettings = ({
  calendar,
  setCalendar,
}: {
  calendar: Calendar | null;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
}) => {
  return <div>IntegrationSettings</div>;
};

export default IntegrationSettings;
