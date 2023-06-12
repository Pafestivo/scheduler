import { useGlobalContext } from '@/app/context/store';
import React from 'react';
import { Availability } from '@prisma/client';
import { getData } from '@/utilities/serverRequests/serverRequests';
import filterDays from '@/utilities/filterDays';

const Availability = () => {
  const { calendar, setCalendar, setLoading } = useGlobalContext();
  const [availabilities, setAvailabilities] = React.useState<never[] | Availability[]>([]);
  const [notAvailableDays, setNotAvailableDays] = React.useState<string[]>([]);

  React.useEffect(() => {
    setLoading(true);

    const getAvailabilities = async () => {
      if (!calendar) return;
      try {
        const response = await getData(`/availability/${calendar.hash}`);
        const offDays = filterDays(response.data);
        setNotAvailableDays(offDays);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getAvailabilities();
  }, [calendar, setLoading]);

  return (
    <div>
      Availability {calendar?.hash} {notAvailableDays}
    </div>
  );
};

export default Availability;
