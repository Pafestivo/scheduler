import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import excludeFields from '../utils/excludeFields.js';

interface CalendarRequest extends Request {
  body: {
    userHash: string;
    name: string;
    padding?: number;
    availabilityHash?: any[]; // assuming availabilityHash is an array
    licenseHash?: string;
    deleted: boolean;
  };
}

// @desc    Add Calendar
// @route   POST /api/v1/calendars
// @access  Public

export const addCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { userHash, name, padding, availabilityHash } = req.body;
  const hash = generateHash(name);
  // Add calendar
  try {
    const calendar = await prisma.calendar.create({
      data: {
        userHash,
        name,
        padding,
        availabilityHash,
        licenseHash: '', 
        hash,
      },
    });

    const response = excludeFields(calendar, ['licenseHash', 'timestamp']);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});

// @desc    Get all user calendars
// @route   GET /api/v1/calendars/:userHash
// @access  Public

export const getCalendars = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { userHash } = req.params;

  try {
    const calendars = await prisma.calendar.findMany({
      where: {
        userHash,
        deleted: false
      }
    })

    if(calendars.length === 0) {
      res.status(200).json({
        success: true,
        data: 'No calendars found for given user.',
      });
    } else {
      res.status(200).json({
        success: true,
        amount: calendars.length,
        data: calendars,
      });
    }
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});