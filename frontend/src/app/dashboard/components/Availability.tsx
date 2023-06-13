import { useGlobalContext } from '@/app/context/store';
import React from 'react';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { filterDays, hasDuplicateDays } from '@/utilities/availabilityFunctions';
import { Typography, Box } from '@mui/material';
import { Availability } from '@/utilities/types';
import CortexTimePicker from '@/components/TimePicker';
import RemoveIcon from '@mui/icons-material/Remove';
const Availability = () => {
  const { calendar, setCalendar, setLoading } = useGlobalContext();
  const [notAvailableDays, setNotAvailableDays] = React.useState<string>('');
  const [repeatingList, setRepeatingList] = React.useState<never[] | Availability[]>(Array(7).fill({}));
  React.useEffect(() => {
    const getAvailabilities = async () => {
      const offDays = filterDays(calendar?.availabilities ? calendar.availabilities : []);
      setNotAvailableDays(offDays);
      if (!hasDuplicateDays(calendar?.availabilities ? calendar.availabilities : []) && calendar?.availabilities) {
        let newArray = Array.from(repeatingList);
        for (const obj of calendar?.availabilities) {
          const index = obj.day;
          newArray[index] = obj;
        }
        setRepeatingList(newArray);
      }
    };
    getAvailabilities();
  }, []);

  return (
    <div>
      Availability {calendar?.hash}
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        Off days:{' '}
      </Typography>
      <Typography variant="body2">{notAvailableDays}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <CortexTimePicker label="Start Time" />
        <RemoveIcon />
        <CortexTimePicker label="End Time" /> */}
      </Box>
    </div>
  );
};

export default Availability;
