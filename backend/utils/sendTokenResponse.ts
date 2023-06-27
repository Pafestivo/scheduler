import { Response } from 'express';
import getSignedJwtToken from './getSignedJwtToken.js';
import { User } from '@prisma/client';

interface TokenOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
  domain?: string;
  sameSite?: string;
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user: User, statusCode: number, res: Response) => {
  // Create token
  const token = getSignedJwtToken(user.hash);

  const options: TokenOptions = {
    expires: new Date(
      // Convert the 30 days in the config to 30 days in milliseconds
      Date.now() + (process.env.JWT_COOKIE_EXPIRE ? parseInt(process.env.JWT_COOKIE_EXPIRE) : 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    domain: '.onrender.com',
    sameSite: 'none',
  };

  // It's up to the client-side to decide how to handle the token
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

export default sendTokenResponse;
