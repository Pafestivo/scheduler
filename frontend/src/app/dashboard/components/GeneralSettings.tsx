import { useGlobalContext } from '@/app/context/store';
import AddPhoto from '@/components/AddPhoto';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Button } from '@mui/material';
import { putData } from '@/utilities/serverRequests/serverRequests';
import FormInput from '@/components/FormInput';

const GeneralSettings = () => {
  const { calendar, setCalendar,  setAlert, setAlertOpen} = useGlobalContext();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('calendar-name') as string
    const description = formData.get('calendar-description') as string
    const password = formData.get('calendar-password') as string

    if(name === '') {
      setAlert({
        message: 'Please enter a name',
        severity: 'error',
        code: 0
      })
      setAlertOpen(true)
      return
    }


    const updatedCalendar = await putData('/calendars', {
      hash: calendar?.hash,
      name: name,
      description: description,
      password: password
    })

    if(updatedCalendar.success && calendar) {
      const updatedName = name ? name : calendar.name
      const updatedDescription = description ? description : calendar.description
      const updatedPassword = password ? password : calendar.password
      setCalendar({...calendar, name: updatedName, description: updatedDescription, password: updatedPassword})
      setAlert({
        message: 'Calendar updated',
        severity: 'success',
        code: 8
      })
      setAlertOpen(true)
    }
  }

  return (
    <div>
      <Box 
      component="form" 
      sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '20rem', rowGap: '10px'}}       
      noValidate
      onSubmit={handleSubmit}
      autoComplete="off"
      >

        <AddPhoto />

        <FormInput
          name='calendar-name'
          label="Calendar Name"
          title='Calendar Name'
          type='text'
          fieldIdx={0}
          defaultValue={calendar?.name}
        />

        <Box>
          <label style={{fontSize: '0.9rem'}} htmlFor="calendar-description">Calendar Description(Optional)</label>
          <TextareaAutosize 
            minRows={3}
            maxRows={4}
            id='calendar-description'
            name='calendar-description'
            style={{ 
              width: '100%',  
              resize: 'none'
            }}
          />
        </Box>

        <TextField
          type='password'
          id="calendar-password"
          name='calendar-password'
          label="Calendar Password(Optional)"
          sx={{ width: '100%' }}
          defaultValue={calendar?.password}
        />

        <Button type='submit' fullWidth={true}>Update!</Button>
      </Box> 
    </div>   
  );
};

export default GeneralSettings;