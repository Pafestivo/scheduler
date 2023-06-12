import { useGlobalContext } from '@/app/context/store';
import AddPhoto from '@/components/AddPhoto';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Button, { buttonClasses } from '@mui/base/Button';
import { styled } from '@mui/system';

const GeneralSettings = () => {
  const { calendar, setCalendar } = useGlobalContext();

  return (
    <div>
      <Box 
      component="form" 
      sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '20rem', rowGap: '10px'}}       
      noValidate
      autoComplete="off"
      >

        <AddPhoto />

        <TextField
          required
          id="calendar-name"
          label="Calendar Name"
          sx={{ width: '100%' }}
          defaultValue={calendar?.name}
        />

        <Box>
          <label style={{fontSize: '0.9rem'}} htmlFor="calendar-description">Calendar Description(Optional)</label>
          <TextareaAutosize 
            minRows={3}
            maxRows={4}
            id='calendar-description'
            style={{ 
              width: '100%',  
              resize: 'none'
            }}
          />
        </Box>

        <TextField
          type='password'
          id="calendar-password"
          label="Calendar Password(Optional)"
          sx={{ width: '100%' }}
          defaultValue={calendar?.password}
        />

        <CustomButton>Button</CustomButton>
      </Box> 
    </div>   
  );
};

export default GeneralSettings;

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const CustomButton = styled(Button)`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${blue[500]};
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;