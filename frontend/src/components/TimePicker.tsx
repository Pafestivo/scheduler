import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function CortexTimePicker({ label, value, onChange }: { label: string; value: string; onChange: any }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker ampm={false} label={label} />
    </LocalizationProvider>
  );
}
