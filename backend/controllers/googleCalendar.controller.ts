import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { IntegrationType } from '@prisma/client';
import { generateGoogleClient } from '../utils/generateGoogleClient.js';
import { google } from 'googleapis'
import dayjs from 'dayjs';

interface integrationRequest extends Request {
  body: {
    token: string;
    refreshToken: string;
    expiresAt: number;
    userEmail: string;
    provider: IntegrationType
  };
}

// @desc    Get appointments from google
// @route   GET /api/v1/googleAppointments/:userEmail
// @access  Public

export const getAppointments = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
  const { userEmail } = req.params;
  const auth = await generateGoogleClient(userEmail)

  if(!auth) {
    res.status(200).json({
      success: false,
      data: 'Authentication failed'
    })
    return;
  }

  const calendar = google.calendar({
    version: 'v3',
    auth: auth,
  })

  const now = (new Date()).toISOString();

  try {
    const calendarEvents = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      singleEvents: true,
      orderBy: 'startTime',
    });
  
    res.status(200).json({
      success: true,
      data: calendarEvents.data.items
    })
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }

});