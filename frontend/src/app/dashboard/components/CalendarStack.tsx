import * as React from 'react';
import Box from '@mui/material/Box';
import CalendarBar from './CalendarBar';
import { Typography } from '@mui/material';
import { useGlobalContext } from '@/app/context/store';
import { getData } from '@/utilities/serverRequests/serverRequests';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NewCalendarModal from './NewCalendarModal';
import IconButton from '@mui/material/IconButton';
import { Calendar } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function CalendarStack() {
  const { user, setLoading, setUser } = useGlobalContext();
  const [formOpen, setFormOpen] = React.useState(false);
  const [calendars, setCalendars] = React.useState<never[] | Calendar[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    setLoading(true);
    const getCalendars: () => Promise<void> = async () => {
      if (user === null) {
        const userResponse = await getData('/auth/me');
        if(!userResponse.success) setUser(undefined)
      } else if (user === undefined) {
        setLoading(false);
        router.push('/login');
        return;
      }
      if (!user) return;
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
          Your Calendars
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {calendars.length ? `Add a new calendar` : `Add a new calendar to start booking appointments.`}
          <IconButton onClick={() => setFormOpen(true)}>
            <AddCircleIcon sx={{ ml: 1, fontSize: 16, cursor: 'pointer' }} />
          </IconButton>
        </Typography>
        {calendars.map((calendar) => (
          <CalendarBar key={calendar.id} calendar={calendar} />
        ))}
      </Box>
      <NewCalendarModal formOpen={formOpen} setFormOpen={setFormOpen} setCalendars={setCalendars} />
    </>
  );
}
