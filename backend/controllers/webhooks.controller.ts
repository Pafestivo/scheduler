import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import { User, Calendar, Appointment } from '@prisma/client';
import getFutureGoogleAppointments from '../utils/fetchGoogleAppointments.js';
import generateHash from '../utils/generateHash.js';
import { findExtraAppointments, findExtraEvents } from '../utils/FindExtraIds.js';

// @desc    Handle Google Calendar Webhooks
// @route   POST /api/v1/webhooks/googleCalendar
// @access  public

export const HandleGoogleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const channelId = req.header('X-Goog-Channel-ID');
  const resourceState = req.header('X-Goog-Resource-State');

  if (!channelId || !resourceState) {
    console.log('operation failed because of missing info');
    res.status(401).end();
    return;
  }
  try {
    const calendar: Calendar | null = await prisma.calendar.findUnique({
      where: {
        watchChannelId: channelId,
      },
    });

    // kill if the channelSid is outdated
    if (!calendar) {
      res.status(200).end();
      return;
    }

    const calendarOwner: User | null = await prisma.user.findUnique({
      where: {
        hash: calendar?.owner,
      },
    });
    if (!calendarOwner || !calendarOwner.email || !calendar?.googleWriteInto) {
      console.log('There was a problem requesting events from google, missing information');
      res.status(401).end();
      return;
    }

    // get all the events ids from google
    let eventsFromGoogle = await getFutureGoogleAppointments(calendarOwner.email, calendar?.googleWriteInto);
    if (!eventsFromGoogle || !eventsFromGoogle.length) eventsFromGoogle = [];
    const eventIdsArray = eventsFromGoogle.map((event) => (event.id ? event.id : ''));
    // get all the appointments ids from the db
    const appointmentsFromDb: Appointment[] = await prisma.appointment.findMany({
      where: {
        calendarHash: calendar?.hash,
      },
    });

    const appointmentsIds = appointmentsFromDb.map((appointment: Appointment) => appointment.googleEventId || 'no Id');

    // add event
    const idsToAdd = findExtraEvents(appointmentsIds, eventIdsArray);
    idsToAdd.forEach(async (id: string) => {
      const event = eventsFromGoogle.find((event) => event.id === id);
      if (event && event.start?.dateTime && event.end?.dateTime) {
        console.log('adding event');
        await prisma.appointment.create({
          data: {
            calendarHash: calendar?.hash,
            userHash: 'Calendar owner',
            status: 'new',
            date: event.start.dateTime,
            startTime: event.start.dateTime?.split('T')[1].slice(0, 5),
            endTime: event.end.dateTime?.split('T')[1].slice(0, 5),
            hash: generateHash(calendar?.hash, event.start.dateTime),
            googleEventId: event.id,
            isConfirmed: true,
          },
        });
      }
    });

    if (eventIdsArray.length !== appointmentsIds.length) {
      // delete event
      const idToRemove = findExtraAppointments(appointmentsIds, eventIdsArray);
      if (idToRemove.length) {
        idToRemove.forEach(async (id: string) => {
          console.log('deleting event');
          await prisma.appointment.delete({
            where: {
              googleEventId: id,
            },
          });
        });
      }
    } else {
      // edit event
      console.log('editing event');
      const eventToEdit = eventsFromGoogle[0];
      if (eventToEdit && eventToEdit.id && eventToEdit.start?.dateTime && eventToEdit.end?.dateTime) {
        await prisma.appointment.update({
          where: {
            googleEventId: eventToEdit.id,
          },
          data: {
            date: eventToEdit.start.dateTime,
            startTime: eventToEdit.start.dateTime?.split('T')[1].slice(0, 5),
            endTime: eventToEdit.end.dateTime?.split('T')[1].slice(0, 5),
          },
        });
      }
    }
    res.status(200).end();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});
