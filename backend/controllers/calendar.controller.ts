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
    return next(new ErrorResponse({ message: error.message, statusCode: 400 }));
  }
});