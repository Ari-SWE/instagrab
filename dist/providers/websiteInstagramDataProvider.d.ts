import { InstagramDataProvider } from './instagramDataProvider';
import { InstagramProfile, InstagramStory, InstagramHighlight, InstagramPost, InstagramMediaResult } from '../types/instagram';
export declare class WebsiteInstagramDataProvider implements InstagramDataProvider {
    readonly name = "WebsiteScraperProvider";
    private browser;
    private getBrowser;
    private createPage;
    getAllMedia(username: string): Promise<InstagramMediaResult>;
    getProfile(username: string): Promise<InstagramProfile>;
    getStories(username: string): Promise<InstagramStory[]>;
    getHighlights(username: string): Promise<InstagramHighlight[]>;
    getPosts(username: string): Promise<InstagramPost[]>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=websiteInstagramDataProvider.d.ts.map