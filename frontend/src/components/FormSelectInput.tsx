import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGlobalContext } from '@/app/context/store';

interface FormSelectInputProps {
  label: string;
  options: string[] | { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState?: (...args: any) => void;
  fieldIdx?: number;
  defaultOption?: string;
  name?: string;
}

const FormSelectInput = ({ label, options, setState, fieldIdx, defaultOption, name }: FormSelectInputProps) => {
  const [value, setValue] = useState(defaultOption || Object.keys(options)[0]);
  const { alert } = useGlobalContext();

  const handleChange = (event: SelectChangeEvent) => {
    setState?.(event.target.value, name);
    setValue(event.target.value);
  };

  React.useEffect(() => {
    setState?.(defaultOption, name);
  }, []);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          name={name}
          labelId={label}
          id={label}
          value={value}
          label={label}
          onChange={handleChange}
          sx={{ backgroundColor: alert?.code === fieldIdx ? 'rgba(245, 132, 132, 0.44)' : null }}
        >
          {/* <MenuItem value="">Select an option</MenuItem> */}
          {Object.entries(options).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormSelectInput;
