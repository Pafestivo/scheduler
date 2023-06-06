import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import excludeFields from '../utils/excludeFields.js';
import { CalendarType } from '@prisma/client';

interface CalendarRequest extends Request {
  body: {
    userHash: string;
    name: string;
    padding?: number;
    availabilityHash?: any[];
    licenseHash?: string;
    deleted: boolean;
    hash: string;
    appointmentsHash: any[];
    type: CalendarType;
    personalForm?: string[];
    integrationId?: number[]
    appointmentsLength: number;
  };
}

// @desc    Add Calendar
// @route   POST /api/v1/calendars
// @access  Private

export const addCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { userHash, name, padding, availabilityHash, personalForm, appointmentsLength } = req.body;
  const hash = generateHash(userHash, name);
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
        personalForm,
        appointmentsLength
      },
    });

    const user = await prisma.user.update({
      where: {
        hash: userHash
      },
      data: {
        type: 'vendor'
      }
    })

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
// @access  Private

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

// @desc    Get single calendar
// @route   GET /api/v1/calendars/single/:hash
// @access  Public

export const getCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { hash } = req.params;

  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash
      }
    })

    if(!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
    } else if(calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are looking for was deleted.',
      });
    } else {
      res.status(200).json({
        success: true,
        data: calendar,
      });
    }
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Delete a single calendar
// @route   DELETE /api/v1/calendars/:hash
// @access  Private

export const deleteCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { hash } = req.params;

  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash
      }
    })

    if(!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
      return;
    } else if(calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are looking for was already deleted.',
      });
      return;
    }

    await prisma.calendar.update({
      where: {
        hash
      },
      data: {
        deleted: true
      }});

    res.status(200).json({
      success: true,
      data: 'Calendar deleted successfully.',
    })
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Update calendar
// @route   PUT /api/v1/calendars
// @access  Private

export const updateCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { 
      hash,
      appointmentsHash, 
      type, 
      name, 
      padding, 
      integrationId,
      appointmentsLength
    } = req.body;

  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash
      }
    })

    if(!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
      return;
    } else if(calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are trying to update was deleted.',
      });
      return;
    }

    // make an update data object to not update undefined
    const updateData: any = {};
    if (appointmentsHash) updateData.appointmentsHash = appointmentsHash;
    if (type) updateData.type = type;
    if (name) updateData.name = name;
    if (padding || padding === 0) updateData.padding = padding;  
    if (appointmentsLength) updateData.appointmentsLength = appointmentsLength;  
    // make sure to add to the integration array and not replacing it
    if (integrationId) {
      let calendarIntegrationId = [];
      if(typeof calendar.integrationId === 'string') {
        try {
          calendarIntegrationId = JSON.parse(calendar.integrationId);
        } catch (error) {
          console.error('Failed to parse calendar.integrationId:', error);
        }
      }
      if (Array.isArray(calendarIntegrationId)) {
        updateData.integrationId = [...calendarIntegrationId, integrationId];
      } else {
        updateData.integrationId = [integrationId];
      }
    }

    const updatedCalendar = await prisma.calendar.update({
      where: {
        hash
      },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: updatedCalendar,
    })
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});