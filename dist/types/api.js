"use strict";
// ── API Response Types ──
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.AppError = void 0;
class AppError extends Error {
    code;
    statusCode;
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
// Pre-built errors for convenience
exports.Errors = {
    invalidUsername: () => new AppError('INVALID_USERNAME', 'The provided username is invalid.', 400),
    emptyUsername: () => new AppError('EMPTY_USERNAME', 'Username cannot be empty.', 400),
    userNotFound: () => new AppError('USER_NOT_FOUND', 'The requested public account could not be found.', 404),
    privateAccount: () => new AppError('PRIVATE_ACCOUNT', 'This account is private and cannot be viewed.', 403),
    noStories: () => new AppError('NO_STORIES', 'No active stories found for this account.', 404),
    noMedia: () => new AppError('NO_MEDIA', 'No media found for this account.', 404),
    noPosts: () => new AppError('NO_POSTS', 'No posts found for this account.', 404),
    upstreamUnavailable: () => new AppError('UPSTREAM_UNAVAILABLE', 'The data provider is temporarily unavailable. Please try again later.', 502),
    rateLimitExceeded: () => new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please wait a moment before trying again.', 429),
    networkTimeout: () => new AppError('NETWORK_TIMEOUT', 'The request timed out. Please try again.', 504),
    internalError: () => new AppError('INTERNAL_ERROR', 'An unexpected error occurred.', 500),
};
//# sourceMappingURL=api.js.map