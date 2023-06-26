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

export const postBooker = asyncHandler(async (req: BookerRequest, res: Response, next: NextFunction) => {
  const { name, email, phone, preferredChannel, appointmentHash } = req.body;

  if(!email && !phone) return next(new ErrorResponse({ message: 'Missing information, email or phone required', statusCode: 403 })); 

  try {
    const booker = await prisma.booker.create({
      data: {
        name,
        email,
        phone,
        preferredChannel,
        appointmentHash: [appointmentHash]
      }
    })

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