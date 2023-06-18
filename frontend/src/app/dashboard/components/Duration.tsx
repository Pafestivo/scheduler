import CortexTimePicker from '@/components/TimePicker';
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useGlobalContext } from '@/app/context/store';
import { BASE_BREAK_END_TIME, BASE_BREAK_START_TIME } from '@/utilities/constants';
import { formatTime } from '@/utilities/availabilityFunctions';
import { postData, putData } from '@/utilities/serverRequests/serverRequests';

interface BreakTime {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
const Duration = () => {
  const { calendar, setAlert, setAlertOpen } = useGlobalContext();
  const [breakTime, setBreakTime] = useState<BreakTime>(
    calendar?.breakTime || { startTime: BASE_BREAK_START_TIME, endTime: BASE_BREAK_END_TIME, isActive: false }
  );
  const [cantSubmit, setCantSubmit] = useState<boolean>(false);
  const [padding, setPadding] = useState<number>(calendar?.padding || 0);
  const [length, setLength] = useState<number>(calendar?.appointmentsLength || 0);
  const handleTimeChange = (value: string, index: number, type: string) => {
    let newBreakTime = { ...breakTime, [type]: value };

    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, startTime: BASE_BREAK_START_TIME };
    }
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, endTime: BASE_BREAK_END_TIME };
    }
    if (breakTime) setBreakTime(newBreakTime);
  };

  const handleCheckboxChange = (index: number) => {
    let newBreakTime = { ...breakTime, isActive: !breakTime.isActive };
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, startTime: BASE_BREAK_START_TIME };
    }
    if (!breakTime.startTime) {
      newBreakTime = { ...newBreakTime, endTime: BASE_BREAK_END_TIME };
    }
    setBreakTime(newBreakTime);
  };

  useEffect(() => {
    let tempBreakTime: BreakTime = {};
    if (calendar?.breakTime) {
      tempBreakTime = { ...calendar.breakTime, isActive: true };
    } else {
      tempBreakTime = { isActive: false };
    }
    setBreakTime(tempBreakTime);
    console.log(calendar);
  }, [calendar]);

  React.useEffect(() => {
    const timesValid = () => {
      const { startTime, endTime } = breakTime;
      if (Number(startTime?.replace(':', '')) >= Number(endTime?.replace(':', ''))) {
        return false;
      }
      return true;
    };
    if (timesValid() && breakTime.isActive) {
      setCantSubmit(false);
    } else if (!timesValid() && breakTime.isActive) {
      setCantSubmit(true);
    } else {
      setCantSubmit(false);
    }
  }, [breakTime]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    let requestBody = {};
    if (breakTime.isActive && breakTime !== calendar?.breakTime) {
      requestBody = {
        breakTime: {
          startTime: breakTime.startTime,
          endTime: breakTime.endTime,
        },
      };
    }
    if (padding && padding !== calendar?.padding) requestBody = { ...requestBody, padding: padding };
    if (length && length !== calendar?.appointmentsLength) requestBody = { ...requestBody, appointmentsLength: length };
    if (Object.keys(requestBody).length === 0) {
      setAlert({ severity: 'warning', message: 'No changes made', code: 200 });
      setAlertOpen(true);
      return;
    }
    try {
      const response = await putData(`/calendar`, { ...requestBody, hash: calendar?.hash });
      console.log(response);
    } catch (error) {}
  };
  return (
    <Box component={'form'} onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">Break Time:</Typography>
      <CortexTimePicker
        defaultActive={breakTime.isActive ? breakTime.isActive : false}
        defaultStartTime={breakTime.startTime ? breakTime.startTime : BASE_BREAK_START_TIME}
        defaultEndTime={breakTime.endTime ? breakTime.endTime : BASE_BREAK_END_TIME}
        handleCheckboxChange={handleCheckboxChange}
        handleTimeChange={handleTimeChange}
      />
      <Typography variant="h6">Appointment Padding:</Typography>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">{`Padding`}</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
        >
          {new Array(13).fill(0).map((_, i) => (
            <MenuItem key={Math.random()} value={i * 5}>
              {`(${formatTime(i * 5)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6">Appointment length:</Typography>
      <FormControl sx={{ m: 1 }} variant="standard">
        <InputLabel id="demo-customized-select-label">{`Padding`}</InputLabel>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        >
          {new Array(61).fill(0).map((_, i) => (
            <MenuItem key={Math.random()} value={i * 5}>
              {`(${formatTime(i * 5)})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" disabled={cantSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default Duration;
