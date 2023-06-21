import schedule from 'node-schedule';
import updateGoogleWatchHook from './utils/updateGoogleWatchHook.js';
import prisma from './utils/prismaClient.js';


// cron job to renew expired watch request on google, runs every sunday at 00:00('0 0 * * 0')
export const renewExpiredWatchRequests = schedule.scheduleJob('*/7 * * * * *', async () => {
  // get all calendars with watch requests
  const calendarsToRenew = await prisma.calendar.findMany({
    where: {
      watchChannelId: {
        not: null
      }
    }
  })

  calendarsToRenew.forEach(async (calendar) => {
    const user = await prisma.user.findUnique({
      where: {
        hash: calendar.owner
      }
    })

    const userEmail = user?.email
    const givenUserCalendar = calendar.googleWriteInto
    const renewal = true

    if(!userEmail || !givenUserCalendar) return; 
    const renewalData = await updateGoogleWatchHook(userEmail, givenUserCalendar, renewal)

    if(!renewalData) return;
    await prisma.calendar.update({
      where: {
        hash: calendar.hash
      }, data: {
        watchChannelId: renewalData.channelId,
        watchChannelToken: renewalData.channelToken
      }
    })
  })
});