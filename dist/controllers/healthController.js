"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = healthController;
function healthController(_req, res, _next) {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        },
    });
}
//# sourceMappingURL=healthController.js.map