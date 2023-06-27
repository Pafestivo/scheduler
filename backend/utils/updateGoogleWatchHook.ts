import crypto from 'crypto';
import { generateGoogleClient } from './generateGoogleClient.js';
import { google } from 'googleapis';
import prisma from './prismaClient.js';
import { Calendar } from '@prisma/client';

const updateGoogleWatchHook = async (userEmail:string, givenUserCalendar: string, renewal = false) => {
  const calendarId = givenUserCalendar || 'Primary';

  const channelId = crypto.randomBytes(20).toString('hex'); // A unique ID for the channel
  const channelToken = crypto.randomBytes(20).toString('hex'); // An arbitrary string delivered with each notification
  let channelAddress;
  if(process.env.NODE_ENV === 'production') {
    channelAddress = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/webhooks/googleCalendar`; // webhook URL for remote
  } else {
    channelAddress = 'https://40af-147-235-209-217.ngrok-free.app/api/v1/webhooks/googleCalendar'; // webhook URL for localhost
  }
  
  

  const auth = await generateGoogleClient(userEmail);

  if (!auth) {
    return false;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  });

  try {

    if(!renewal) {
      // check if watch already exists for given calendar
      const existingWatch: Calendar | null = await prisma.calendar.findFirst({
        where: {
          googleWriteInto: calendarId,
          watchChannelId: {
            not: null
          }
        }
      })
      // if it exists just return the existing watch details
      if(existingWatch) {
        return { channelId: existingWatch.watchChannelId, channelToken: existingWatch.watchChannelToken }
      }
    }

    const googleWatch = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: channelAddress,
        token: channelToken,
        params: {
          ttl: '1209600', // expires after two weeks, cron jobs runs every 1 week
        },
      },
    });

    renewal ? console.log('Google watch renewed for:', userEmail) : console.log('Google watch created:', googleWatch.data);
    return { googleWatch, channelId, channelToken }

  } catch(err) {
    console.error('Failed to create watch:', err);
    return false;
  }
};

export default updateGoogleWatchHook;
