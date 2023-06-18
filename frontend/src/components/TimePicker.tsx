import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Box, Checkbox, Switch, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CortexTimePicker({
  defaultStartTime,
  defaultEndTime,
  handleTimeChange,
  index,
  defaultActive,
  handleCheckboxChange,
}: {
  defaultStartTime: string;
  defaultEndTime: string;
  handleTimeChange: any;
  index?: number;
  defaultActive: boolean;
  handleCheckboxChange: any;
}) {
  const [active, setActive] = React.useState<boolean>(defaultActive);
  const [startTime, setStartTime] = React.useState<string>(defaultStartTime);
  const [endTime, setEndTime] = React.useState<string>(defaultEndTime);
  const [isTimeValid, setIsTimeValid] = React.useState<boolean>(true);

  React.useEffect(() => {
    const validateWorkHours = () => {
      if (startTime === endTime) {
        return setIsTimeValid((prev) => (prev = false));
      }
      if (dayjs(dayjs().format('YYYY-MM-DDT') + startTime).isAfter(dayjs(dayjs().format('YYYY-MM-DDT') + endTime))) {
        return setIsTimeValid((prev) => (prev = false));
      }
      return setIsTimeValid((prev) => (prev = true));
    };
    validateWorkHours();
  }, [startTime, endTime]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        key={index}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Switch
          checked={active}
          onChange={() => {
            setActive(!active);
            handleCheckboxChange(index);
          }}
        />
        {index !== undefined && (
          <Typography variant="body1" sx={{ width: '50px' }}>
            {days[index]}
          </Typography>
        )}
        <TimePicker
          sx={{ visibility: active ? 'visible' : 'hidden', backgroundColor: isTimeValid ? 'white' : 'red' }}
          ampm={false}
          label={'Start Time'}
          onChange={(value) => {
            setStartTime((prev) => (prev = dayjs(value).format('HH:mm')));
            handleTimeChange(dayjs(value).format('HH:mm'), index, 'startTime');
          }}
          value={dayjs(dayjs().format('YYYY-MM-DDT') + `${startTime}`)}
        />
        <RemoveIcon sx={{ visibility: active ? 'visible' : 'hidden' }} />
        <TimePicker
          sx={{ visibility: active ? 'visible' : 'hidden' }}
          ampm={false}
          label={'End Time'}
          onChange={(value) => {
            setEndTime((prev) => (prev = dayjs(value).format('HH:mm')));
            handleTimeChange(dayjs(value).format('HH:mm'), index, 'endTime');
          }}
          value={dayjs(dayjs().format('YYYY-MM-DDT') + `${endTime}`)}
        />
      </Box>
    </LocalizationProvider>
  );
}
