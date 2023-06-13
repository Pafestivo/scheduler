import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import excludeFields from '../utils/excludeFields.js';
import { Appointment, CalendarIntegration, CalendarType, Integration, License, User } from '@prisma/client';
import { Calendar } from '@prisma/client';

interface CalendarRequest extends Request {
  body: {
    userHash: string;
    name: string;
    padding?: number;
    availabilities?: any[];
    licenseHash?: string;
    deleted: boolean;
    hash: string;
    appointmentsHash: any[];
    type: CalendarType;
    personalForm?: string[];
    integrationId?: number[];
    appointmentsLength: number;
    image: string;
    description: string;
    password: string;
  };
}

interface fullCalendarResponse extends Calendar {
  license?: License;
  appointments: Appointment[];
  integrations: CalendarIntegration[];
  users: User[];
}

// @desc    Add Calendar
// @route   POST /api/v1/calendars
// @access  Private

export const addCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { userHash, name, image } = req.body;
  const hash = generateHash(userHash, name);
  // Add calendar
  const hashArray = [userHash];
  try {
    const calendar = await prisma.calendar.create({
      data: {
        userHash: hashArray,
        name,
        image,
        hash,
      },
    });

    interface userContains extends User {
      calendars: string[];
    }

    const user = (await prisma.user.findUnique({
      where: {
        hash: userHash,
      },
    })) as userContains;

    if (user) {
      const newUser = await prisma.user.update({
        where: {
          hash: userHash,
        },
        data: {
          calendars: user.calendars ? [...user.calendars, calendar.hash] : [calendar.hash],
          type: 'vendor',
        },
      });
    }

    const response = excludeFields(calendar, ['licenseHash', 'timestamp']);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
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
        userHash: {
          array_contains: userHash,
        },
        deleted: false,
      },
    });

    if (calendars.length === 0) {
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
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Get all the deleted user calendars
// @route   GET /api/v1/calendars/deleted/:userHash
// @access  Private

export const getDeletedCalendars = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { userHash } = req.params;

  try {
    const calendars = await prisma.calendar.findMany({
      where: {
        userHash: {
          array_contains: userHash,
        },
        deleted: true,
      },
    });

    if (calendars.length === 0) {
      res.status(200).json({
        success: true,
        data: 'No deleted calendars for given user.',
      });
    } else {
      res.status(200).json({
        success: true,
        amount: calendars.length,
        data: calendars,
      });
    }
  } catch (error: any) {
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
        hash: hash,
      },
    });

    if (!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
    } else if (calendar.deleted) {
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
  } catch (error: any) {
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
        hash,
      },
    });

    if (!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
      return;
    } else if (calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are looking for was already deleted.',
      });
      return;
    }

    await prisma.calendar.update({
      where: {
        hash,
      },
      data: {
        deleted: true,
      },
    });

    res.status(200).json({
      success: true,
      data: 'Calendar deleted successfully.',
    });
  } catch (error: any) {
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
    appointmentsLength,
    userHash,
    description,
    password,
    availabilities,
  } = req.body;

  try {
    const calendar = await prisma.calendar.findUnique({
      where: {
        hash,
      },
    });

    if (!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
      return;
    } else if (calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are trying to update was deleted.',
      });
      return;
    }
    console.log(availabilities);

    // make an update data object to not update undefined
    const updateData: any = {};
    if (appointmentsHash) updateData.appointmentsHash = appointmentsHash;
    if (type) updateData.type = type;
    if (description) updateData.description = description;
    if (password) updateData.password = password;
    if (name) updateData.name = name;
    if (availabilities) updateData.availabilities = availabilities;
    if (padding || padding === 0) updateData.padding = padding;
    if (appointmentsLength) updateData.appointmentsLength = appointmentsLength;
    // make sure to add to the integration array and not replacing it
    if (integrationId) {
      if (Array.isArray(calendar.integrationId)) {
        updateData.integrationId = [...calendar.integrationId, integrationId];
      } else {
        updateData.integrationId = [integrationId];
      }
    }
    if (userHash) {
      if (Array.isArray(calendar.userHash)) {
        updateData.userHash = [...calendar.userHash, userHash];
      } else {
        updateData.userHash = [userHash];
      }
    }

    const updatedCalendar = await prisma.calendar.update({
      where: {
        hash,
      },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedCalendar,
    });
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Get fullCalendar
// @route   GET /calendars/fullCalendar/:hash
// @access  Public

export const getFullCalendar = asyncHandler(async (req: CalendarRequest, res: Response, next: NextFunction) => {
  const { hash } = req.params;

  try {
    let calendar = (await prisma.calendar.findUnique({
      where: {
        hash,
      },
    })) as fullCalendarResponse;

    if (!calendar) {
      res.status(200).json({
        success: true,
        data: 'No calendar with given hash was found.',
      });
      return;
    } else if (calendar.deleted) {
      res.status(200).json({
        success: true,
        data: 'The calendar you are looking for was already deleted.',
      });
      return;
    }

    if (calendar.licenseHash) {
      const license = (await prisma.license.findFirst({
        where: {
          hash: calendar.licenseHash,
        },
      })) as License;
      calendar = { ...calendar, license };
    }

    if (calendar.appointmentsHash) {
      const appointments = await prisma.appointment.findMany({
        where: {
          calendarHash: hash,
        },
      });
      calendar = { ...calendar, appointments };
    }

    if (calendar.integrationId) {
      const integrations = await prisma.calendarIntegration.findMany({
        where: {
          calendarHash: hash,
        },
      });
      calendar = { ...calendar, integrations };
    }

    const users = await prisma.user.findMany({
      where: {
        calendars: {
          array_contains: hash,
        },
      },
    });
    calendar = { ...calendar, users };

    res.status(200).json({
      success: true,
      data: calendar,
    });
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});
