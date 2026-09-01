"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCors = configureCors;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("../config/env");
function configureCors() {
    const origins = env_1.config.cors.allowedOrigins;
    if (origins === '*') {
        return (0, cors_1.default)();
    }
    const allowedOrigins = origins.split(',').map((o) => o.trim());
    return (0, cors_1.default)({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });
}
//# sourceMappingURL=cors.js.map