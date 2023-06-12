import React from 'react';
import TabSettings from './TabSettings';
import Availability from './Availability';
import Duration from './Duration';
import Timezone from './Timezone';
import { Calendar } from '@prisma/client';

const AvailabilitySettings = ({
  calendar,
  setCalendar,
}: {
  calendar: Calendar | null;
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
}) => {
  const COMPONENTS = [
    {
      name: 'Availability',
      component: <Availability />,
    },
    {
      name: 'Duration',
      component: <Duration />,
    },
    {
      name: 'Timezone',
      component: <Timezone />,
    },
  ];
  return <TabSettings components={COMPONENTS} />;
};

export default AvailabilitySettings;
