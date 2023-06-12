import { Calendar } from '@prisma/client';
import React from 'react';

const GeneralSettings = ({
  calendar,
  setCalendar,
}: {
  calendar: Calendar | null;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
}) => {
  return <div>GeneralSettings</div>;
};

export default GeneralSettings;
