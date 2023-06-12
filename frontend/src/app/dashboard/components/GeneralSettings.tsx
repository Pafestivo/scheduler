import { useGlobalContext } from '@/app/context/store';
import React from 'react';

const GeneralSettings = () => {
  const { calendar, setCalendar } = useGlobalContext();
  return <div>GeneralSettings</div>;
};

export default GeneralSettings;
