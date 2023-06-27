import { useGlobalContext } from '@/app/context/store';
import { putData } from '@/utilities/serverRequests/serverRequests';
import { Box, Button, TextareaAutosize } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AfterBooking = () => {
  const [thanksMessage, setThanksMessage] = useState<string>('');
  const {calendar, setAlert, setAlertOpen, setLoading} = useGlobalContext();

  const updateThankYouMessage = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const updated = await putData('/calendars', {
      hash: calendar?.hash,
      thankYouMessage: thanksMessage
    })
    if(updated.success) {
      setAlert({ message: 'Message updated successfully', severity: 'success', code: 0 });
    } else {
      setAlert({ message: 'Failed to update message', severity: 'error', code: 0 });
    }
    setLoading(false)
    setAlertOpen(true)
  }

  useEffect(() => {
    setThanksMessage(calendar?.thankYouMessage || '')
  }, [calendar?.thankYouMessage])

  return (
    <Box component={'form'} onSubmit={updateThankYouMessage}>
      <TextareaAutosize 
          minRows={4}
          aria-label="minimum height"
          defaultValue={thanksMessage}
          onChange={(e) => {setThanksMessage(e.target.value)}}
      />
      <Button type={'submit'}>Update</Button>
    </Box>
  );
};

export default AfterBooking;
