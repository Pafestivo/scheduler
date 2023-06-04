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
  // make the calendar work

  // let date = new Date(); // get current date and time
  // date.setMinutes(date.getMinutes() + 10); // add 10 minutes
  // let isoDate = date.toISOString(); // get date and time in ISO format
  
  // const schedulingDate = dayjs(isoDate).startOf('hour')

  // await calendar.events.insert({
  //   calendarId: 'primary',
  //   conferenceDataVersion: 1,
  //   requestBody: {
  //     summary: `Ignite Call: test`,
  //     description: 'test',
  //     start: {
  //       dateTime: schedulingDate.format(),
  //     },
  //     end: {
  //       dateTime: schedulingDate.add(1, 'hour').format(),
  //     },
  //   },
  // })

  // return res.status(201).end()
});