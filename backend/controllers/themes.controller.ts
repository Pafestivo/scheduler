import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import prisma from "../utils/prismaClient.js";

interface ThemeRequest extends Request {
  body: {
    id: number;
  };
}

// @desc    Get all themes
// @route   GET /api/v1/themes
// @access  Public

export const getAllThemes = asyncHandler(
  async (req: ThemeRequest, res: Response, next: NextFunction) => {
    try {
      // update the appointment with the booker's info
      const themes = await prisma.themes.findMany();

      res.status(200).send({
        success: true,
        data: themes,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
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

// @desc    get specific theme
// @route   GET /api/v1/themes/:id
// @access  Public

export const getThemeById = asyncHandler(
  async (req: ThemeRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const theme = await prisma.themes.findUnique({
        where: {
          id: Number(id),
        },
      });

      res.status(200).send({
        success: true,
        data: theme,
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
