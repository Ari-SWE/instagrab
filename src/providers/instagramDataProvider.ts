import {
  InstagramProfile,
  InstagramStory,
  InstagramHighlight,
  InstagramPost,
  InstagramMediaResult,
} from '../types/instagram';

/**
 * Abstract interface for Instagram data providers.
 *
 * This abstraction allows swapping the upstream data source
 * without modifying controllers or the service layer.
 * To add a new provider, implement this interface and register
 * it in the InstagramService.
 */
export interface InstagramDataProvider {
  /** Provider name for logging/debugging */
  readonly name: string;

  /** Fetch profile information for a given username */
  getProfile(username: string): Promise<InstagramProfile>;

  /** Fetch active stories for a given username */
  getStories(username: string): Promise<InstagramStory[]>;

  /** Fetch recent posts for a given username */
  getPosts(username: string): Promise<InstagramPost[]>;

  /** Fetch highlights for a given username */
  getHighlights(username: string): Promise<InstagramHighlight[]>;

  /** Fetch all media (profile + stories + highlights + posts) in one call */
  getAllMedia(username: string): Promise<InstagramMediaResult>;
}
