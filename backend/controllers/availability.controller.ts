import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import { addToAvailabilityArray } from '../utils/addToAvailabilityArray.js';
import excludeFields from '../utils/excludeFields.js';

interface AvailabilityRequest extends Request {
  body: {
    calendarHash: string;
    day: number;
    startTime: string;
    endTime: string;
    hash: string;
  };
}

// @desc    Add availability
// @route   POST /api/v1/availability
// @access  private

export const addAvailability = asyncHandler(async (req: AvailabilityRequest, res: Response, next: NextFunction) => {
  const { calendarHash, day, startTime, endTime } = req.body;

  if (!calendarHash) {
    return next(new ErrorResponse({ message: 'No calendar hash provided', statusCode: 400 }));
  }

  if(isNaN(day) || day > 6 || day < 0) {
    return next(new ErrorResponse({ message: 'Invalid day', statusCode: 400 }));
  }
  
  if (!startTime || !endTime) {
    return next(new ErrorResponse({ message: 'Missing information', statusCode: 400 }));
  }

  const hash = generateHash(calendarHash, day, startTime, endTime);
  // Add availability
  try {
    const availability = await prisma.availability.create({
      data: {
        calendarHash,
        day,
        startTime,
        endTime,
        hash
      }
    });

    const updatedCalendar = await addToAvailabilityArray(calendarHash, hash)
    // if calendar not found, delete the availability and return error
    if(!updatedCalendar) {
      await prisma.availability.delete({
        where: {
          hash
        }
      });
      return next(new ErrorResponse({ message: 'Calendar not found or deleted.', statusCode: 404 }));
    } 

    res.status(200).json({
      success: true,
      data: {
        calendar: updatedCalendar,
        availability
      },
    });

  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
})

// @desc    Get availabilities for specific calendar
// @route   GET /api/v1/availability
// @access  private

export const getAvailabilities = asyncHandler(async (req: AvailabilityRequest, res: Response, next: NextFunction) => {
  const { calendarHash } = req.params;

  if (!calendarHash) {
    return next(new ErrorResponse({ message: 'No calendar hash provided', statusCode: 400 }));
  }

  try {
    const availabilities = await prisma.availability.findMany({
      where: {
        calendarHash
      }
    });

    // exclude unnecessary fields from each object
    const response:any[] = []
    availabilities.forEach(availability => {
      const availabilityToSend = excludeFields(availability, ['calendarHash', 'id', 'timestamp'])
      response.push(availabilityToSend)
    })

    res.status(200).json({
      success: true,
      amount: response.length,
      data: response,
    });

  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
})

// @desc    Delete availability
// @route   DELETE /api/v1/availability
// @access  private

export const deleteAvailability = asyncHandler(async (req: AvailabilityRequest, res: Response, next: NextFunction) => {
  const { hash, calendarHash } = req.body;

  try {
    await prisma.availability.delete({
      where: {
        hash
      }
    })

    const calendar = await prisma.calendar.findUnique({
      where: {
        hash: calendarHash
      }
    })

    if(calendar) {
      let newAvailabilityArray:string[] = [];
      if (calendar.availabilityHash) {
        newAvailabilityArray = [...calendar.availabilityHash as string[]]; 
        const updatedAvailability = newAvailabilityArray.filter((availabilityHash: string) => availabilityHash !== hash);

        await prisma.calendar.update({
          where: {
            hash: calendarHash
          },
          data: {
            availabilityHash: updatedAvailability
          }
        })
      } 
    }

    res.status(200).json({
      success: true,
      data: "availability preference deleted successfully."
    })

  } catch(error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
})

// @desc    Update availability
// @route   PUT /api/v1/availability
// @access  private

export const updateAvailability = asyncHandler(async (req: AvailabilityRequest, res: Response, next: NextFunction) => {
  const { hash, day, startTime, endTime } = req.body;

  // make an update data object to not update undefined
  const updateData: any = {};
  if (day) updateData.day = day;
  if (startTime) updateData.startTime = startTime;
  if (endTime) updateData.endTime = endTime;

  try {
    const updatedAvailability = await prisma.availability.update({
      where: {
        hash
      }, 
      data: updateData
    })

    res.status(200).json({
      success: true,
      data: updatedAvailability
    })
  } catch(error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
})