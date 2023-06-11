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
  options: string[];
  setState?: React.Dispatch<React.SetStateAction<{ [key:string]:string }>>;
  fieldIdx?: number;
}

const FormSelectInput = ({ label, options, setState, fieldIdx }: FormSelectInputProps) => {

  const [value, setValue] = useState('');
  const { alert } = useGlobalContext();

  const handleChange = (event: SelectChangeEvent) => {
    if(setState) setState(prevState => ({...prevState, [`${label}`]: event.target.value}));
    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          labelId={label}
          id={label}
          value={value}
          label={label}
          onChange={handleChange}
          sx={{ backgroundColor: alert?.code === fieldIdx ? 'rgba(245, 132, 132, 0.44)' : null }}
        >
          <MenuItem value="">Select an option</MenuItem>
          {Object.entries(options).map(([key, value]) => (
            <MenuItem key={key} value={key}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default FormSelectInput;