import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import { NextFunction, Response } from 'express';
import { UserRequest } from '../models/types.js';
import dotenv from 'dotenv';
dotenv.config();
interface HashVerified {
  hash: string;
  expiresIn: number;
}
// Protect Routes
export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    // We can access the token from the header with req.headers.authorization
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Format it - remove Bearer from string - turn into array and return the second index
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(console.error('No user logged in'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as HashVerified;

    const foundUser = await prisma.user.findUnique({ where: { hash: decoded.hash } });
    if (!foundUser) {
      const message = 'Not authorized to access this route';
      return next(new ErrorResponse({ message, statusCode: 401 }));
    }
    req.user = foundUser;
    next();
  } catch (error) {
    const message = 'Not authorized to access this route';
    return next(new ErrorResponse({ message, statusCode: 401 }));
  }
});

// Grant access to specific roles
// Pass in a comma separated list of roles
export const authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.type)) {
      const message = `User role '${req.user?.type}' is not authorized to access this route`;
      return next(new ErrorResponse({ message, statusCode: 403 }));
    }
    next();
  };
};
