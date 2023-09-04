import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import prisma from "../utils/prismaClient.js";

// @desc    get translation
// @route   GET /api/v1/translations/:lang
// @access  Public

export const getTranslation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lang } = req.params;

    if (!lang) {
      return next(
        new ErrorResponse({ message: "No language provided", statusCode: 403 })
      );
    }

    try {
      const translation = await prisma.translations.findUnique({
        where: {
          language: lang,
        },
      });

      res.status(200).json({
        success: true,
        data: translation,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return next(
        new ErrorResponse({
          message: error.message,
          statusCode: 400,
          errorCode: error.code,
        })
      );
    }
  }
);
