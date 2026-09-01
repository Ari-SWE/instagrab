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
export type ErrorCode = 'INVALID_USERNAME' | 'EMPTY_USERNAME' | 'USER_NOT_FOUND' | 'PRIVATE_ACCOUNT' | 'NO_STORIES' | 'NO_MEDIA' | 'NO_POSTS' | 'UPSTREAM_UNAVAILABLE' | 'RATE_LIMIT_EXCEEDED' | 'NETWORK_TIMEOUT' | 'INTERNAL_ERROR';
export declare class AppError extends Error {
    code: ErrorCode;
    statusCode: number;
    constructor(code: ErrorCode, message: string, statusCode?: number);
}
export declare const Errors: {
    invalidUsername: () => AppError;
    emptyUsername: () => AppError;
    userNotFound: () => AppError;
    privateAccount: () => AppError;
    noStories: () => AppError;
    noMedia: () => AppError;
    noPosts: () => AppError;
    upstreamUnavailable: () => AppError;
    rateLimitExceeded: () => AppError;
    networkTimeout: () => AppError;
    internalError: () => AppError;
};
//# sourceMappingURL=api.d.ts.map