import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import { IntegrationType } from '@prisma/client';
import { getIntegrationDetails } from '../utils/getIntegrationDetails.js';
import { google } from 'googleapis';
import dayjs from 'dayjs';
import { encrypt, decrypt } from '../utils/encryptDecrypt.js';

interface integrationRequest extends Request {
  body: {
    token: string;
    refreshToken: string;
    expiresAt: number;
    userEmail: string;
    provider: IntegrationType;
  };
}

// @desc    Add integration
// @route   POST /api/v1/integration
// @access  Public

export const addIntegration = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
  const { token, refreshToken, expiresAt, userEmail, provider } = req.body;
  const encryptedToken = encrypt(token);
  const encryptedRefreshToken = encrypt(refreshToken);
  try {
    const findIntegration = await prisma.integration.findMany({
      where: {
        userEmail,
        provider,
      },
    });

    if (findIntegration.length > 0) {
      res.status(200).json({
        success: false,
        message: 'Integration already exists',
      });
    } else {
      const integration = await prisma.integration.create({
        data: {
          token: encryptedToken.encrypted,
          refreshToken: encryptedRefreshToken.encrypted,
          tokenIv: encryptedToken.iv,
          refreshTokenIv: encryptedRefreshToken.iv,
          expiresAt,
          userEmail,
          provider,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (user) {
        prisma.calendar.updateMany({
          where: {
            owner: user.hash,
          },
          data: {
            integrationId: {
              push: integration.id,
            },
          },
        });
      }
      res.status(200).json({
        success: true,
        data: integration,
      });
    }
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});

// @desc    Get all user integrations
// @route   GET /api/v1/integration/:userEmail
// @access  Private

export const getAllUserIntegrations = asyncHandler(
  async (req: integrationRequest, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;

    try {
      const integration = await prisma.integration.findMany({
        where: {
          userEmail,
        },
      });

      res.status(200).json({
        success: true,
        amount: integration.length,
        data: integration,
      });
    } catch (error: any) {
      return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
    }
  }
);
