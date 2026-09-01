"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("./logger"));
class CacheService {
    cache;
    constructor() {
        this.cache = new node_cache_1.default({
            stdTTL: env_1.config.cache.ttlSeconds,
            checkperiod: 120,
            useClones: true,
        });
        this.cache.on('expired', (key) => {
            logger_1.default.debug(`Cache expired: ${key}`);
        });
    }
    get(key) {
        const value = this.cache.get(key);
        if (value) {
            logger_1.default.debug(`Cache hit: ${key}`);
        }
        else {
            logger_1.default.debug(`Cache miss: ${key}`);
        }
        return value;
    }
    set(key, value, ttl) {
        logger_1.default.debug(`Cache set: ${key}`);
        if (ttl !== undefined) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }
    del(key) {
        return this.cache.del(key);
    }
    flush() {
        this.cache.flushAll();
        logger_1.default.info('Cache flushed');
    }
    getStats() {
        return this.cache.getStats();
    }
}
exports.cacheService = new CacheService();
//# sourceMappingURL=cache.js.map