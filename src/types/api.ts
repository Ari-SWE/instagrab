// ── API Response Types ──

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  cached?: boolean;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ErrorCode =
  | 'INVALID_USERNAME'
  | 'EMPTY_USERNAME'
  | 'USER_NOT_FOUND'
  | 'PRIVATE_ACCOUNT'
  | 'NO_STORIES'
  | 'NO_MEDIA'
  | 'NO_POSTS'
  | 'UPSTREAM_UNAVAILABLE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_TIMEOUT'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Pre-built errors for convenience
export const Errors = {
  invalidUsername: () =>
    new AppError('INVALID_USERNAME', 'The provided username is invalid.', 400),
  emptyUsername: () =>
    new AppError('EMPTY_USERNAME', 'Username cannot be empty.', 400),
  userNotFound: () =>
    new AppError('USER_NOT_FOUND', 'The requested public account could not be found.', 404),
  privateAccount: () =>
    new AppError('PRIVATE_ACCOUNT', 'This account is private and cannot be viewed.', 403),
  noStories: () =>
    new AppError('NO_STORIES', 'No active stories found for this account.', 404),
  noMedia: () =>
    new AppError('NO_MEDIA', 'No media found for this account.', 404),
  noPosts: () =>
    new AppError('NO_POSTS', 'No posts found for this account.', 404),
  upstreamUnavailable: () =>
    new AppError('UPSTREAM_UNAVAILABLE', 'The data provider is temporarily unavailable. Please try again later.', 502),
  rateLimitExceeded: () =>
    new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please wait a moment before trying again.', 429),
  networkTimeout: () =>
    new AppError('NETWORK_TIMEOUT', 'The request timed out. Please try again.', 504),
  internalError: () =>
    new AppError('INTERNAL_ERROR', 'An unexpected error occurred.', 500),
};
