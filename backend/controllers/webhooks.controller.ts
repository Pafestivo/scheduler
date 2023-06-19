import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import excludeFields from '../utils/excludeFields.js';
import { Appointment, CalendarIntegration, CalendarType, Integration, License, User } from '@prisma/client';
import { Calendar } from '@prisma/client';
import updateGoogleWatchHook from '../utils/updateGoogleWatchHook.js';

// @desc    Handle Google Calendar Webhooks
// @route   POST /api/v1/webhooks/googleCalendar
// @access  public

export const HandleGoogleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const channelId = req.header('X-Goog-Channel-ID');
  const resourceState = req.header('X-Goog-Resource-State');

  if(!channelId || !resourceState) {
    console.log('operation failed because of missing info');
    return;
  }
  try {
    const calendar = prisma.calendar.findUnique({
      where: {
        watchChannelId: channelId
      }
    })

    // fetch events from both google and db and compare them to see what changed
    // then operate on the db accordingly

  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});