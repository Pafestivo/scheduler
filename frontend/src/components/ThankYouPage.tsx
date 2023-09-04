'use client'
import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';

interface ThankYouPageProps {
  calendarHash: string;
  bookerHash: string;
}

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  'thankYouMessage': 'Thank you for placing your appointment, {name}!',
};

const ThankYou = ( { calendarHash, bookerHash } : ThankYouPageProps ) => {
  const [booker, setBooker] = useState<{ name: string } | null>(null);
  const [calendar, setCalendar] = useState< {thankYouMessage: string} | null >(null);
  const {setLoading, translations} = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;
  useEffect(() => {
    setLoading(true)
  }, [setLoading])

  useEffect(() => {
    if(booker && calendar) setLoading(false)
  }, [booker, calendar, setLoading])

  const getBooker = useCallback(async () => {
    const currentBooker = await getData(`bookers/${bookerHash}`)
    setBooker(currentBooker.data)
  }, [bookerHash])

  const getCalendar = useCallback(async () => {
    const currentCalendar = await getData(`/calendars/single/${calendarHash}`)
    setCalendar(currentCalendar.data)
  }, [calendarHash])

  useEffect(() => {
    getBooker()
    getCalendar()
  }, [getBooker, getCalendar, setLoading])

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: '10rem', color: '#00b894' }} />
      <h1>{t('thankYouMessage').replace('{name}', booker?.name || '')}</h1>
      <p style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '60rem' }}>{calendar?.thankYouMessage}</p>
    </Box>
  );
};

export default ThankYou;