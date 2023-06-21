import schedule from 'node-schedule';
import updateGoogleWatchHook from './utils/updateGoogleWatchHook.js';
import prisma from './utils/prismaClient.js';


// cron job to renew expired watch request on google, runs every sunday at 00:00('0 0 * * 0')
export const renewExpiredWatchRequests = schedule.scheduleJob('0 0 * * 0', async () => {

  // get all calendars with watch requests
  const calendarsToRenew = await prisma.calendar.findMany({
    where: {
      watchChannelId: {
        not: null
      }
    }
  })

  if(!calendarsToRenew.length) return;

  const renewedWatches: {userEmail: string, calendar: string, watchChannelId: string, watchChannelToken: string}[] = []

  for (const calendar of calendarsToRenew) {
    const user = await prisma.user.findUnique({
      where: {
        hash: calendar.owner
      }
    })

    const userEmail = user?.email
    const givenUserCalendar = calendar.googleWriteInto
    const renewal = true

    if(!userEmail || !givenUserCalendar) return;
    // if the same calendar has already a renewed watch, we don't need a second watch
    if(renewedWatches.find(renewed => renewed.userEmail === userEmail && renewed.calendar === givenUserCalendar)) {
      const renewed = renewedWatches.find((ren) => ren.userEmail === userEmail && ren.calendar === givenUserCalendar);
      
      if(!renewed) return
      await prisma.calendar.update({
        where: {
          hash: calendar.hash
        }, data: {
          watchChannelId: renewed.watchChannelId,
          watchChannelToken: renewed.watchChannelToken
        }
      })
      return;
    }


    const renewalData = await updateGoogleWatchHook(userEmail, givenUserCalendar, renewal)

    if(!renewalData || !renewalData.channelId || !renewalData.channelToken) return;
    await prisma.calendar.update({
      where: {
        hash: calendar.hash
      }, data: {
        watchChannelId: renewalData.channelId,
        watchChannelToken: renewalData.channelToken
      }
    })
    renewedWatches.push({
      userEmail: userEmail, 
      calendar: givenUserCalendar, 
      watchChannelId: renewalData.channelId, 
      watchChannelToken: renewalData.channelToken})
  }
});