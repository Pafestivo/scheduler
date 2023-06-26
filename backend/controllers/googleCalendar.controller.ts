import { Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { generateGoogleClient } from '../utils/generateGoogleClient.js';
import { google } from 'googleapis';
import prisma from '../utils/prismaClient.js';
import { IntegrationRequest } from '../models/types.js';
import { integrations } from 'googleapis/build/src/apis/integrations/index.js';

// @desc    Get appointments from google
// @route   GET /api/v1/googleAppointments/:userEmail
// @access  Public

export const getAppointments = asyncHandler(async (req: IntegrationRequest, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  const { googleReadFrom } = req.body;
  const auth = await generateGoogleClient(userEmail);

  if (!auth) {
    res.status(200).json({
      success: false,
      data: 'Authentication failed',
    });
    return;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  });

  const now = new Date().toISOString();

  try {
    const calendarEvents = await calendar.events.list({
      calendarId: googleReadFrom || 'primary',
      timeMin: now,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.status(200).json({
      success: true,
      data: calendarEvents.data.items,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Get calendars from google
// @route   GET /api/v1/googleCalendars/:userEmail
// @access  Public

export const getCalendars = asyncHandler(async (req: IntegrationRequest, res: Response, next: NextFunction) => {
  const { userHash } = req.params;
  console.log(userHash);
  const integration = await prisma.integration.findFirst({
    where: {
      userHash,
      provider: 'google',
    },
  });
  console.log('integration', integration);

  if (!integration) {
    return next(new ErrorResponse({ message: 'No user hash found', statusCode: 400, errorCode: 'no_user_hash' }));
  }
  if (integration.userHash) {
    const auth = await generateGoogleClient(integration.userHash);
    if (!auth) {
      res.status(200).json({
        success: false,
        data: 'Authentication failed',
      });
      return;
    }

    const calendar = google.calendar({
      version: 'v3',
      auth: auth,
    });

    try {
      const userCalendars = await calendar.calendarList.list();

      res.status(200).json({
        success: true,
        data: userCalendars.data.items,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
    }
  }
});

// @desc    post appointment to google
// @route   POST /api/v1/googleAppointments/:userEmail
// @access  Public

export const postAppointment = asyncHandler(async (req: IntegrationRequest, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  const { googleWriteInto, summary, date, startTime, endTime, hash } = req.body;

  const auth = await generateGoogleClient(userEmail);

  if (!auth) {
    res.status(200).json({
      success: false,
      data: 'Authentication failed',
    });
    return;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  });

  const formatDate = date.split('T')[0];
  console.log('the date:', `${formatDate}T${startTime}:00`);

  try {
    const calendarEvent = await calendar.events.insert({
      calendarId: googleWriteInto || 'primary',
      requestBody: {
        summary: summary,
        start: {
          dateTime: `${formatDate}T${startTime}:00`, // 2023-06-30T12:00
          timeZone: 'Asia/Jerusalem',
        },
        end: {
          dateTime: `${formatDate}T${endTime}:00`, // 2023-06-30T13:00
          timeZone: 'Asia/Jerusalem',
        },
      },
    });
    await prisma.appointment.update({
      where: {
        hash: hash,
      },
      data: {
        googleEventId: calendarEvent.data.id,
      },
    });

    res.status(200).json({
      success: true,
      data: calendarEvent.data,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});
