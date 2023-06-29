import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import generateHash from '../utils/generateHash.js';
import { comparePassword, generateHashedPassword } from '../utils/passwordManager.js';
import excludeFields from '../utils/excludeFields.js';

interface Iuser {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string | null;
  asWhatsapp: boolean;
  acceptPromotions: boolean;
  pfp: string | null;
  hash: string;
  calendars: string[] | null;
  timestamp: string;
  hashedPassword?: string;
  hashedResetToken: string | null;
}
interface AuthRequest extends Request {
  user?: Iuser;
  body: {
    email: string;
    password: string;
    hash: string;
    name?: string;
    type?: string;
    phone?: string;
    asWhatsapp?: boolean;
    acceptPromotions?: boolean;
    pfp?: string;
    currentPassword?: string;
    newPassword?: string;
    provider?: string;
  };
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public

export const registerUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password, acceptPromotions, phone, name, provider } = req.body;
  console.log(req.body)
  const hash = generateHash(email);
  let hashedPassword;
  // Create user
  try {
    const findIntegration = await prisma.integration.findFirst({
      where: {
        userEmail: email,
      }
    });

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      res.status(200).json({
        success: false,
        message: 'User already exists',
      });
    } else {
      if (password) hashedPassword = await generateHashedPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          acceptPromotions,
          phone,
          name,
          hash,
          provider: findIntegration ? findIntegration.provider : provider,
        },
      });

      sendTokenResponse(user, 200, res);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

export const loginUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password, provider } = req.body;

  if (provider) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return next(new ErrorResponse({ message: 'Invalid credentials', statusCode: 401 }));

    sendTokenResponse(user, 200, res);
    return;
  }

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
  if (!user.hashedPassword)
    return next(new ErrorResponse({ message: 'Please login with exernal provider', statusCode: 401 }));
  const isMatch = await comparePassword(password, user.hashedPassword);

  if (!isMatch) {
    return next(new ErrorResponse({ message: 'Invalid credentials', statusCode: 401 }));
  }
  //
  sendTokenResponse(user, 200, res);
});

// @desc    logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    // Set cookie to expire in 0.1 second
    expires: new Date(Date.now() + 0.1 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    domain: process.env.COOKIE_DOMAIN,
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me/
// @access  Private

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  // the middlewear 'protect' sets the req.user if token was verified
  if (req.user) {
    const response = excludeFields(req.user, ['hashedPassword', 'hashedResetToken', 'timestamp']);
    res.status(200).json({ success: true, data: response });
  } else res.status(200).json({ success: false, data: 'No user found' });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private

export const updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, name, phone, asWhatsapp, acceptPromotions, pfp, hash } = req.body;

  if (!hash) {
    res.status(401).json({ success: false, data: 'No hash provided' });
  } else if (!email && !name && !phone && !asWhatsapp && !acceptPromotions && !pfp) {
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

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
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

// @desc    Get user by hash
// @route   GET /api/v1/auth/singleUser/:userHash
// @access  Public

export const getUserByHash = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userHash } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        hash: userHash,
      },
    });

    if (!user) {
      return next(new ErrorResponse({ message: 'User not found', statusCode: 404 }));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 400, errorCode: error.code }));
  }
});
