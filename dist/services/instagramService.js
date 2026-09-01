"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramService = void 0;
const cache_1 = require("../utils/cache");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Instagram service layer — sits between controllers and providers.
 * Handles caching and request deduplication.
 */
class InstagramService {
    provider;
    pendingRequests = new Map();
    constructor(provider) {
        this.provider = provider;
        logger_1.default.info(`InstagramService initialized with provider: ${provider.name}`);
    }
    /**
     * Get all media for a username. Checks cache first, deduplicates concurrent requests.
     */
    async getAllMedia(username) {
        const cacheKey = `media:${username}`;
        const cached = cache_1.cacheService.get(cacheKey);
        if (cached)
            return cached;
        // Deduplicate: if the same username is already being fetched, reuse that promise
        if (this.pendingRequests.has(cacheKey)) {
            logger_1.default.debug(`Deduplicating request for: ${username}`);
            return this.pendingRequests.get(cacheKey);
        }
        const fetchPromise = this.provider.getAllMedia(username).then((result) => {
            cache_1.cacheService.set(cacheKey, result);
            this.pendingRequests.delete(cacheKey);
            return result;
        }).catch((error) => {
            this.pendingRequests.delete(cacheKey);
            throw error;
        });
        this.pendingRequests.set(cacheKey, fetchPromise);
        return fetchPromise;
    }
    async getProfile(username) {
        const result = await this.getAllMedia(username);
        return result.profile;
    }
    async getStories(username) {
        const result = await this.getAllMedia(username);
        return result.stories;
    }
    async getPosts(username) {
        const result = await this.getAllMedia(username);
        return result.posts;
    }
    async getHighlights(username) {
        const result = await this.getAllMedia(username);
        return result.highlights;
    }
}
exports.InstagramService = InstagramService;
//# sourceMappingURL=instagramService.js.map