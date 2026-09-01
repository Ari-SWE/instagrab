"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const api_1 = require("../types/api");
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    if (err instanceof api_1.AppError) {
        logger_1.default.warn(`AppError [${err.code}]: ${err.message}`);
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
    logger_1.default.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: env_1.config.isDev
                ? err.message
                : 'An unexpected error occurred.',
        },
    });
}
//# sourceMappingURL=errorHandler.js.map