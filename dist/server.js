"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const cors_1 = require("./middleware/cors");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = require("./routes");
const instagramService_1 = require("./services/instagramService");
const websiteInstagramDataProvider_1 = require("./providers/websiteInstagramDataProvider");
const logger_1 = __importDefault(require("./utils/logger"));
async function main() {
    const app = (0, express_1.default)();
    // ── Middleware ──
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.configureCors)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use('/api', rateLimiter_1.apiRateLimiter);
    // ── Service Setup ──
    const provider = new websiteInstagramDataProvider_1.WebsiteInstagramDataProvider();
    const service = new instagramService_1.InstagramService(provider);
    // ── Routes ──
    app.use('/api', (0, routes_1.createRouter)(service));
    // ── Error Handler (must be last) ──
    app.use(errorHandler_1.errorHandler);
    // ── Start Server ──
    const server = app.listen(env_1.config.port, () => {
        logger_1.default.info(`🚀 InstaGrab API running on port ${env_1.config.port}`);
        logger_1.default.info(`   Environment: ${env_1.config.nodeEnv}`);
        logger_1.default.info(`   Upstream:    ${env_1.config.upstream.baseUrl}`);
    });
    // ── Graceful Shutdown ──
    const shutdown = async () => {
        logger_1.default.info('Shutting down...');
        server.close();
        await provider.destroy();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
main().catch((error) => {
    logger_1.default.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map