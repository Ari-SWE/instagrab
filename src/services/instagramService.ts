import { InstagramDataProvider } from '../providers/instagramDataProvider';
import { InstagramMediaResult, InstagramProfile, InstagramStory, InstagramPost, InstagramHighlight } from '../types/instagram';
import { cacheService } from '../utils/cache';
import logger from '../utils/logger';

/**
 * Instagram service layer — sits between controllers and providers.
 * Handles caching and request deduplication.
 */
export class InstagramService {
  private pendingRequests: Map<string, Promise<InstagramMediaResult>> = new Map();

  constructor(private provider: InstagramDataProvider) {
    logger.info(`InstagramService initialized with provider: ${provider.name}`);
  }

  /**
   * Get all media for a username. Checks cache first, deduplicates concurrent requests.
   */
  async getAllMedia(username: string): Promise<InstagramMediaResult> {
    const cacheKey = `media:${username}`;
    const cached = cacheService.get<InstagramMediaResult>(cacheKey);
    if (cached) return cached;

    // Deduplicate: if the same username is already being fetched, reuse that promise
    if (this.pendingRequests.has(cacheKey)) {
      logger.debug(`Deduplicating request for: ${username}`);
      return this.pendingRequests.get(cacheKey)!;
    }

    const fetchPromise = this.provider.getAllMedia(username).then((result) => {
      cacheService.set(cacheKey, result);
      this.pendingRequests.delete(cacheKey);
      return result;
    }).catch((error) => {
      this.pendingRequests.delete(cacheKey);
      throw error;
    });

    this.pendingRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  async getProfile(username: string): Promise<InstagramProfile> {
    const result = await this.getAllMedia(username);
    return result.profile;
  }

  async getStories(username: string): Promise<InstagramStory[]> {
    const result = await this.getAllMedia(username);
    return result.stories;
  }

  async getPosts(username: string): Promise<InstagramPost[]> {
    const result = await this.getAllMedia(username);
    return result.posts;
  }

  async getHighlights(username: string): Promise<InstagramHighlight[]> {
    const result = await this.getAllMedia(username);
    return result.highlights;
  }
}
