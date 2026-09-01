import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';
import logger from '../utils/logger';
import { config } from '../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Don't expose internal errors to the client
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.isDev
        ? err.message
        : 'An unexpected error occurred.',
    },
  });
}
