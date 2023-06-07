import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import excludeFields from '../utils/excludeFields.js';
import { addToAppointmentsArray } from '../utils/addToAppointmentsArray.js';

enum AppointmentStatus {
  new = 'new',
  confirmed = 'confirmed',
  completed = 'completed',
  canceled = 'canceled',
  rescheduled = 'rescheduled'
}

interface AppointmentsRequest extends Request {
  body: {
    calendarHash: string;
    userHash?: string;
    status?: AppointmentStatus;
    date: string;
    time: string;
    hash?: string;
    transaction?: number;
    answersArray?: { [key:string]:string };
  };
}

// @desc    Add Appointment
// @route   POST /api/v1/appointments
// @access  Private

export const addAppointment = asyncHandler(async (req: AppointmentsRequest, res: Response, next: NextFunction) => {
  const { calendarHash, userHash, date, time, answersArray } = req.body;
  const hash = generateHash(calendarHash, date);

  if(!calendarHash) {
    return next(new ErrorResponse({ message: 'No calendar hash provided', statusCode: 400 }));
  }
  if(!date || !time) {
    return next(new ErrorResponse({ message: 'Missing information(date and time is required)', statusCode: 400 }));
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        calendarHash,
        userHash: userHash || 'Guest',
        status: 'new',
        date,
        time,
        answersArray,
        hash
      },
    });

    const updatedCalendar = await addToAppointmentsArray(calendarHash, hash)

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
      data: appointment,
    });
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});

// @desc    Get Appointment
// @route   GET /api/v1/appointments/single/:appointmentHash
// @access  Public

export const getSingleAppointment = asyncHandler(async (req: AppointmentsRequest, res: Response, next: NextFunction) => {
  const { appointmentHash } = req.params;

  if(!appointmentHash) {
    return next(new ErrorResponse({ message: 'No appointment hash provided', statusCode: 400 }));
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        hash: appointmentHash
      }
    })
    if(!appointment) {
      return next(new ErrorResponse({ message: 'Appointment not found', statusCode: 404 }));
  }

  res.status(200).json({
    success: true,
    data: appointment
  })

} catch (error:any) {
  return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
}})

// @desc    Get all calendar appointments
// @route   GET /api/v1/appointments/:calendarHash
// @access  Public

export const getAllCalendarAppointments = asyncHandler(async (req: AppointmentsRequest, res: Response, next: NextFunction) => {
  const { calendarHash } = req.params;

  if(!calendarHash) {
    return next(new ErrorResponse({ message: 'No appointment hash provided', statusCode: 400 }));
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        calendarHash
      }
    })

    if(appointments.length === 0) {
      return next(new ErrorResponse({ message: 'No appointments found for given calendar', statusCode: 404 }));
    }

    // exclude unnecessary fields from each object
    const response:any[] = []
    appointments.forEach(appointment => {
      const appointmentToSend = excludeFields(appointment, ['calendarHash', 'id', 'timestamp'])
      response.push(appointmentToSend)
    })

    res.status(200).json({
      success: true,
      amount: response.length,
      data: response
    })

} catch (error:any) {
  return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
}})

// @desc    update appointment details
// @route   PUT /api/v1/appointments
// @access  Private

export const updateAppointment = asyncHandler(async (req: AppointmentsRequest, res: Response, next: NextFunction) => {
  const { hash, date, time, status, transaction } = req.body;

  if (!hash) {
    return next(new ErrorResponse({ message: 'No hash provided', statusCode: 400 }));
  }

  // get the appointment to check some of it's current fields
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        hash
      }
    })

    if(!appointment) {
      return next(new ErrorResponse({ message: 'Appointment not found', statusCode: 404 }));
    }

    // handle status change
    let cancelTime = appointment.cancelTime;
    let isConfirmed = appointment.isConfirmed;
    if(status === 'canceled' && !cancelTime) cancelTime = new Date().toISOString();
    if(status === 'confirmed' && !isConfirmed) isConfirmed = true;

    // make update object to skip null values
    const updateData: any = {};
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (cancelTime) updateData.cancelTime = cancelTime;
    if (isConfirmed) updateData.isConfirmed = isConfirmed;
    if (transaction) updateData.transaction = transaction;

    // actually update the value
    const updatedAppointment = await prisma.appointment.update({
      where: {
        hash
      },
      data: updateData
    })

    res.status(200).json({
      success: true,
      data: updatedAppointment
    })

  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
})