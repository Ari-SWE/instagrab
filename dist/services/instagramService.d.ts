import { InstagramDataProvider } from '../providers/instagramDataProvider';
import { InstagramMediaResult, InstagramProfile, InstagramStory, InstagramPost, InstagramHighlight } from '../types/instagram';
/**
 * Instagram service layer — sits between controllers and providers.
 * Handles caching and request deduplication.
 */
export declare class InstagramService {
    private provider;
    private pendingRequests;
    constructor(provider: InstagramDataProvider);
    /**
     * Get all media for a username. Checks cache first, deduplicates concurrent requests.
     */
    getAllMedia(username: string): Promise<InstagramMediaResult>;
    getProfile(username: string): Promise<InstagramProfile>;
    getStories(username: string): Promise<InstagramStory[]>;
    getPosts(username: string): Promise<InstagramPost[]>;
    getHighlights(username: string): Promise<InstagramHighlight[]>;
}
//# sourceMappingURL=instagramService.d.ts.map