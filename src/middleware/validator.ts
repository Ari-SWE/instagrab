import { Request, Response, NextFunction } from 'express';
import { normalizeUsername, isValidUsername } from '../utils/usernameNormalizer';
import { Errors } from '../types/api';

/**
 * Middleware that validates and normalizes the :username route parameter.
 * After this middleware, req.params.username is guaranteed to be a clean, valid username.
 */
export function validateUsername(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const rawUsername = req.params.username as string;

  if (!rawUsername || rawUsername.trim().length === 0) {
    return next(Errors.emptyUsername());
  }

  const normalized = normalizeUsername(rawUsername);

  if (!isValidUsername(normalized)) {
    return next(Errors.invalidUsername());
  }

  // Replace the param with the normalized version
  req.params.username = normalized;
  next();
}
