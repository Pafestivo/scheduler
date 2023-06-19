import crypto from 'crypto';
import { generateGoogleClient } from './generateGoogleClient.js';
import { google } from 'googleapis';

const updateGoogleWatchHook = async (userEmail:string, givenUserCalendar: string) => {
  const calendarId = givenUserCalendar || 'Primary';

  const channelId = crypto.randomBytes(20).toString('hex'); // A unique ID for the channel
  const channelToken = crypto.randomBytes(20).toString('hex'); // An arbitrary string delivered with each notification
  const channelAddress = 'https://yourdomain.com/notification'; // Replace with your own receiving URL

  const auth = await generateGoogleClient(userEmail)

  if(!auth) {
    return false;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  })

  try {
    const googleWatch = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: channelAddress,
        token: channelToken,
        params: {
          ttl: '3600',  // Expires after one hour - cron has to run every hour
        },
      },
    })

    console.log('Google watch created:', googleWatch.data);
    return { googleWatch, channelId, channelToken }

  } catch(err) {
    console.error('Failed to create watch:', err);
    return false;
  };
}

export default updateGoogleWatchHook;