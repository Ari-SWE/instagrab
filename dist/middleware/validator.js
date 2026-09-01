"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = validateUsername;
const usernameNormalizer_1 = require("../utils/usernameNormalizer");
const api_1 = require("../types/api");
/**
 * Middleware that validates and normalizes the :username route parameter.
 * After this middleware, req.params.username is guaranteed to be a clean, valid username.
 */
function validateUsername(req, _res, next) {
    const rawUsername = req.params.username;
    if (!rawUsername || rawUsername.trim().length === 0) {
        return next(api_1.Errors.emptyUsername());
    }
    const normalized = (0, usernameNormalizer_1.normalizeUsername)(rawUsername);
    if (!(0, usernameNormalizer_1.isValidUsername)(normalized)) {
        return next(api_1.Errors.invalidUsername());
    }
    // Replace the param with the normalized version
    req.params.username = normalized;
    next();
}
//# sourceMappingURL=validator.js.map