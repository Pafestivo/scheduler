'use client';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Stack, Avatar, Typography, Badge } from '@mui/material';
// import { Calendar } from '@/utilities/types';
import cortexIcon from '../../../assets/Icon.webp';

import Link from 'next/link';
import ActionBox from './ActionBox';
import { Calendar } from '@/utilities/types';
const CalendarBar = ({ calendar }: { calendar: Calendar }) => {
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
              src={calendar.image ? calendar.image : cortexIcon.src}
            />
          </Badge>
        </Stack>
        <Stack sx={{ minWidth: 0 }}>
          <Typography textAlign={'start'} noWrap>
            {calendar.name}
          </Typography>
          <Typography fontWeight={'200'} fontSize={'0.8rem'} noWrap>
            <Link title="Manage Calendar" href={calendarManagerUrl} passHref>
              {calendarBookingUrl.length > 50 ? calendarBookingUrl.substring(0, 50) + '...' : calendarBookingUrl}
            </Link>
          </Typography>
        </Stack>
      </Stack>
      <ActionBox url={calendarBookingUrl} hash={calendar.hash} />
    </Item>
  );
};

export default CalendarBar;