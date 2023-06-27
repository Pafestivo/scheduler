'use client'
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';

const rescheduleConfirmPage = () => {
  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: '10rem', color: '#00b894' }} />
      <h1>Thank you! Your appointment has been updated.</h1>
    </Box>
  )
};

export default rescheduleConfirmPage;
