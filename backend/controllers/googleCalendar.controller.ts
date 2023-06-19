import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { IntegrationType } from '@prisma/client';
import { generateGoogleClient } from '../utils/generateGoogleClient.js';
import { google } from 'googleapis';
import dayjs from 'dayjs';

interface integrationRequest extends Request {
  body: {
    token: string;
    refreshToken: string;
    expiresAt: number;
    userEmail: string;
    provider: IntegrationType;
    googleReadFrom: string;
    googleWriteInto: string;
    summary: string;
    date: string;
    startTime: string;
    endTime: string;
  };
}

// @desc    Get appointments from google
// @route   GET /api/v1/googleAppointments/:userEmail
// @access  Public

export const getAppointments = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
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
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Get calendars from google
// @route   GET /api/v1/googleCalendars/:userEmail
// @access  Public

export const getCalendars = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;

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

  try {
    const userCalendars = await calendar.calendarList.list();

    res.status(200).json({
      success: true,
      data: userCalendars.data.items,
    });
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    post appointment to google
// @route   POST /api/v1/googleAppointments/:userEmail
// @access  Public

export const postAppointment = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  const { googleWriteInto, summary, date, startTime, endTime } = req.body;

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
    console.log(calendarEvent.data);

    res.status(200).json({
      success: true,
      data: calendarEvent.data,
    });
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});
