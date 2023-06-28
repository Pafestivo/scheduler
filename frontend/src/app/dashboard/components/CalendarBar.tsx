'use client';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Stack, Avatar, Typography, Badge } from '@mui/material';
// import { Calendar } from '@/utilities/types';
// import cortexIcon from '../../../assets/Icon.webp';
import Link from 'next/link';
import ActionBox from './ActionBox';
import { Calendar } from '@prisma/client';
const CalendarBar = ({ calendar, calendars ,setCalendars }: { calendar: Calendar, calendars: Calendar[], setCalendars: (calendars: Calendar[]) => void }) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const calendarBookingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/book/${calendar.hash}`;
  const calendarManagerUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${calendar.hash}`;
  return (
    <Item
      sx={{
        my: 1,
        mx: 'auto',
        p: 2,
        display: 'flex',
      }}
    >
      <Stack sx={{ flexGrow: 1 }} spacing={2} direction="row" alignItems="center">
        <Stack>
          <Badge
            overlap="circular"
            variant="dot"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={''}
            color={calendar.isActive ? 'secondary' : 'error'}
          >
            <Avatar
              sx={{ backgroundColor: 'black', p: '2' }}
              alt={calendar.name}
              src={calendar.image ? calendar.image : ''}
            />
          </Badge>
        </Stack>
        <Stack sx={{ minWidth: 0 }}>
          <Typography textAlign={'start'} noWrap>
            <Link title="Manage Calendar" href={calendarManagerUrl} passHref>
              {calendar.name}
            </Link>
          </Typography>
        </Stack>
      </Stack>
      <ActionBox url={calendarBookingUrl} hash={calendar.hash} calendars={calendars} setCalendars={setCalendars} />
    </Item>
  );
};

export default CalendarBar;
