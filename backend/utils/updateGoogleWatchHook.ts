import crypto from 'crypto';
import { generateGoogleClient } from './generateGoogleClient.js';
import { google } from 'googleapis';
import prisma from './prismaClient.js';
import { Calendar } from '@prisma/client';

const updateGoogleWatchHook = async (userEmail: string, givenUserCalendar: string) => {
  const calendarId = givenUserCalendar || 'Primary';

  const channelId = crypto.randomBytes(20).toString('hex'); // A unique ID for the channel
  const channelToken = crypto.randomBytes(20).toString('hex'); // An arbitrary string delivered with each notification
  // const channelAddress = `${process.env.NEXT_PUBLIC_BASE_URL}/webhooks/googleCalendar`; // webhook URL for remote
  const channelAddress = 'https://a169-147-235-209-217.ngrok-free.app/api/v1/webhooks/googleCalendar'; // webhook URL for localhost

  const auth = await generateGoogleClient(userEmail);

  if (!auth) {
    return false;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  });

  try {
    // check if watch already exists for given calendar
    const existingWatch: Calendar | null = await prisma.calendar.findFirst({
      where: {
        googleWriteInto: calendarId,
        watchChannelId: {
          not: null,
        },
      },
    });
    // if it exists just return the existing watch details
    if (existingWatch) {
      return { channelId: existingWatch.watchChannelId, channelToken: existingWatch.watchChannelToken };
    }

    const googleWatch = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: channelAddress,
        token: channelToken,
        params: {
          ttl: '3600', // Expires after one hour - cron has to run every hour
          // in production, change hour to a week
        },
      },
    });

    console.log('Google watch created:', googleWatch.data);
    return { googleWatch, channelId, channelToken };
  } catch (err) {
    console.error('Failed to create watch:', err);
    return false;
  }
};

export default updateGoogleWatchHook;
