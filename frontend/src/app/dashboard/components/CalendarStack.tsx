import * as React from 'react';
import Box from '@mui/material/Box';
import CalendarBar from './CalendarBar';
import { Button, Typography } from '@mui/material';
import { useGlobalContext } from '@/app/context/store';
import { getData } from '@/utilities/serverRequests/serverRequests';
import NewCalendarModal from './NewCalendarModal';
import { Calendar } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface EnglishFallbackType {
  [key: string]: string;
}

const englishFallback: EnglishFallbackType = {
  'yourCalendars': 'Your Calendars',
  'newCalendar': 'New Calendar'
};

export default function CalendarStack() {
  const { user, setLoading, setUser } = useGlobalContext();
  const [formOpen, setFormOpen] = React.useState(false);
  const [calendars, setCalendars] = React.useState<never[] | Calendar[]>([]);
  const router = useRouter();
  const { translations } = useGlobalContext();
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;

  React.useEffect(() => {
    setLoading(true)
    const getCalendars: () => Promise<void> = async () => {
      if(!user) return;
      const response = await getData(`/calendars/${user.hash}`);
      if (response.amount) setCalendars(response.data);
      setLoading(false);
    };
    getCalendars();
  }, [user, setLoading, setUser, router]);

  return (
    <>
      <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          {t('yourCalendars')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => setFormOpen(true)}>{t('newCalendar')}</Button>
        </Typography>
        {calendars.map((calendar) => (
          <CalendarBar key={calendar.id} calendar={calendar} calendars={calendars} setCalendars={setCalendars} />
        ))}
      </Box>
      <NewCalendarModal formOpen={formOpen} setFormOpen={setFormOpen} setCalendars={setCalendars} />
    </>
  );
}
