import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import prisma from '../utils/prismaClient.js';
import { IntegrationType } from '@prisma/client';
import { encrypt } from '../utils/encryptDecrypt.js';
import dayjs from 'dayjs';

interface integrationRequest extends Request {
  body: {
    token: string;
    refreshToken: string;
    expiresAt: number;
    userEmail: string;
    provider: IntegrationType;
    aTiv: string;
    rTiv: string;
    userHash: string;
  };
}

// @desc    Add integration
// @route   POST /api/v1/integration
// @access  Public

// export const addIntegration = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
//   const { token, refreshToken, expiresAt, userEmail, provider } = req.body;
//   const encryptedToken = encrypt(token);
//   const encryptedRefreshToken = encrypt(refreshToken);
//   try {
//     const findIntegration = await prisma.integration.findMany({
//       where: {
//         userEmail,
//         provider,
//       },
//     });

//     if (findIntegration.length > 0) {
//       res.status(200).json({
//         success: false,
//         message: 'Integration already exists',
//       });
//     } else {
//       const integration = await prisma.integration.create({
//         data: {
//           token: encryptedToken.encrypted,
//           refreshToken: encryptedRefreshToken.encrypted,
//           tokenIv: encryptedToken.iv,
//           refreshTokenIv: encryptedRefreshToken.iv,
//           expiresAt,
//           userEmail,
//           provider,
//         },
//       });

//       const user = await prisma.user.findUnique({
//         where: {
//           email: userEmail,
//         },
//       });

//       if (user) {
//         prisma.calendar.updateMany({
//           where: {
//             owner: user.hash,
//           },
//           data: {
//             integrationId: {
//               push: integration.id,
//             },
//           },
//         });
//       }
//       res.status(200).json({
//         success: true,
//         data: integration,
//       });
//     }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
//   }
// });

export const addIntegration = asyncHandler(async (req: integrationRequest, res: Response, next: NextFunction) => {
  const { token, refreshToken, expiresAt, userEmail, provider, aTiv, rTiv, userHash } = req.body;

  try {
    const findIntegration = await prisma.integration.findMany({
      where: {
        userHash,
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
          token: token,
          refreshToken: refreshToken,
          tokenIv: aTiv,
          refreshTokenIv: rTiv,
          expiresAt: dayjs(expiresAt).unix(),
          userEmail,
          userHash,
          provider,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          hash: userHash,
        },
      });

      if (user) {
        await prisma.calendar.updateMany({
          where: {
            owner: user.hash,
          },
          data: {
            integrationId: [integration.id],
          },
        });
      }
      res.status(200).json({
        success: true,
        data: integration,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
  }
});
// @desc    Get all user integrations
// @route   GET /api/v1/integration/:userEmail
// @access  Private

export const getAllUserIntegrations = asyncHandler(
  async (req: integrationRequest, res: Response, next: NextFunction) => {
    const { userHash } = req.params;

    try {
      const integration = await prisma.integration.findMany({
        where: {
          userHash: userHash,
        },
      });
      res.status(200).json({
        success: true,
        amount: integration.length,
        data: integration,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return next(new ErrorResponse({ message: error.message, statusCode: 500, errorCode: error.code }));
    }
  }
);
