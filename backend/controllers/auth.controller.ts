import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import { comparePassword, generateHashedPassword } from '../utils/passwordManager.js';
import excludeFields from '../utils/excludeFields.js';

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
    hash?: string;
    name?: string;
    type?: string;
    phone?: string;
    asWhatsapp?: boolean;
    acceptPromotions?: boolean;
    pfp?: string;
    currentPassword?: string;
    newPassword?: string;
  };
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

export const registerUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password, acceptPromotions, phone, name } = req.body;
  const hash = generateHash(email);
  // Create user
  try {
    const hashedPassword = await generateHashedPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        hash,
      },
    });

    sendTokenResponse(user, 200, res);
  } catch (error:any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

export const loginUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse({ message: 'Please provide an email and password', statusCode: 400 }));
  }

  // Check for user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new ErrorResponse({ message: 'Invalid credentials', statusCode: 401 }));
  }

  // Check if password matches
  const isMatch = await generateHashedPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse({ message: 'Invalid credentials', statusCode: 401 }));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private

export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token', {
    // Set cookie to expire in 10 seconds
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me/:hash
// @access  Private

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { hash } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        hash,
      },
    });

    if (!user) {
      res.status(400).json({ success: false, data: 'User not found' });
    } else {
      const response = excludeFields(user, ['hashedPassword', 'hashedResetToken', 'timestamp']);
      res.status(200).json({ success: true, data: response });
    }
  } catch (error) {
    console.log('err', error)
    res.status(400).json({ success: false, data: error });
  }
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private

export const updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, name, phone, asWhatsapp, acceptPromotions, pfp, hash } = req.body;

  if (!email || !name || !phone || !asWhatsapp || !acceptPromotions || !pfp) {
    res.status(400).json({ success: false, data: 'No fields to update' });
  } else {
    let data = {};
    if (email) data = { ...data, email };
    if (name) data = { ...data, name };
    if (phone) data = { ...data, phone };
    if (asWhatsapp) data = { ...data, asWhatsapp };
    if (acceptPromotions) data = { ...data, acceptPromotions };
    if (pfp) data = { ...data, pfp };
    try {
      const user = await prisma.user.update({
        where: {
          hash,
        },
        data,
      });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, data: error });
    }
  }
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword, hash } = req.body;

  if (!hash) {
    res.status(400).json({ success: false, data: 'No hash provided' });
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, data: 'No fields to update' });
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          hash,
        },
      });

      if (!user) {
        res.status(400).json({ success: false, data: 'User not found' });
      } else if (user && user.hashedPassword) {
        const isMatch = await comparePassword(currentPassword, user.hashedPassword);
        if (!isMatch) {
          res.status(400).json({ success: false, data: 'Invalid credentials' });
        } else {
          const hashedPassword = await generateHashedPassword(newPassword);
          const updatedUser = await prisma.user.update({
            where: {
              hash,
            },
            data: {
              hashedPassword,
            },
          });
          const response = excludeFields(updatedUser, ['hashedPassword', 'hashedResetToken', 'timestamp']);
          res.status(200).json({ success: true, data: response });
        }
      }
    } catch (error) {
      res.status(400).json({ success: false, data: error });
    }
  }
});