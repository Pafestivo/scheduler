import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGlobalContext } from '@/app/context/store';
import { Checkbox, FormControlLabel } from '@mui/material';

interface FormSelectInputProps {
  label: string;
  setState?: React.Dispatch<React.SetStateAction<{ [key:string]:string }>>;
  fieldIdx?: number;
}

const FormCheckInput = ({ label, setState, fieldIdx }: FormSelectInputProps) => {

  const [value, setValue] = useState('');
  const { alert } = useGlobalContext();

  const handleChange = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    const checkedValue = checked ? 'true' : 'false';
    if(setState) setState(prevState => ({...prevState, [`${label}`]: checkedValue}));
    setValue(checkedValue);
  };
  

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <FormControlLabel 
        control={<Checkbox />} 
        label={label} 
        sx={{ backgroundColor: alert?.code === fieldIdx ? 'rgba(245, 132, 132, 0.44)' : null, padding: "10px" }}
        onChange={handleChange} 
        />
      </FormControl>
    </Box>
  );
}

export default FormCheckInput;