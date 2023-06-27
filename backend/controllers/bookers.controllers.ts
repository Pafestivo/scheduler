import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';

interface BookerRequest extends Request {
  body: {
    name: string,
    email?: string,
    phone?: string,
    preferredChannel: string,
    appointmentHash: string
  };
}


// @desc    Add booker
// @route   POST /api/v1/bookers
// @access  Public

export const postOrUpdateBooker = asyncHandler(async (req: BookerRequest, res: Response, next: NextFunction) => {
  const { name, email, phone, preferredChannel, appointmentHash } = req.body;

  if(!email && !phone) return next(new ErrorResponse({ message: 'Missing information, email or phone required', statusCode: 403 })); 

  try {
    let booker = null;

    // if phone was given, look for a booker by phone
    if (phone) {
      booker = await prisma.booker.findUnique({
        where: {
          phone
        }
      });
      console.log('user found by phone')
    }
    
    // if no booker found but we have an email, look for booker by email
    if (!booker && email) {
      booker = await prisma.booker.findUnique({
        where: {
          email
        }
      });
      console.log('user found by email')
    }

    // if no booker found, create a new one
    if(!booker) {
      booker = await prisma.booker.create({
        data: {
          name,
          email,
          phone,
          preferredChannel,
          appointmentHash: [appointmentHash]
        }
      })
      console.log('user created')
    // if a booker found, add the appointment to it's appointments array
    } else {
      let appointmentHashArray = [];
      if (Array.isArray(booker.appointmentHash)) {
        appointmentHashArray = [...booker.appointmentHash, appointmentHash];
      } else {
        appointmentHashArray = [appointmentHash];
      }
      await prisma.booker.update({
        where: {
          id: booker.id
        },
        data: {
          appointmentHash: appointmentHashArray,
          preferredChannel
        }
      })
      console.log('user updated')
    }
   

    // update the appointment with the booker's info
    await prisma.appointment.update({
      where: {
        hash: appointmentHash
      }, data: {
        userHash: phone ? phone : email
      }
    })

    res.status(200).json({
      success: true,
      data: booker
    })


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});