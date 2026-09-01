"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    upstream: {
        baseUrl: process.env.UPSTREAM_BASE_URL || 'https://insta-stories-viewer.com',
    },
    cache: {
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10),
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
    },
    puppeteer: {
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
        timeout: parseInt(process.env.PUPPETEER_TIMEOUT || '30000', 10),
        userAgent: process.env.PUPPETEER_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
    isDev: (process.env.NODE_ENV || 'development') === 'development',
};
//# sourceMappingURL=env.js.map