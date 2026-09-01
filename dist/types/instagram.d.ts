export interface InstagramProfile {
    username: string;
    displayName: string;
    profilePictureUrl: string;
    hdProfilePictureUrl?: string;
    isVerified: boolean;
    isPrivate: boolean;
    bio: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
}
export interface InstagramStory {
    id: string;
    type: 'image' | 'video';
    thumbnailUrl: string;
    mediaUrl: string;
    duration?: number;
    createdAt?: string;
}
export interface InstagramHighlight {
    id: string;
    title: string;
    coverUrl: string;
    itemCount: number;
    items: InstagramStory[];
}
export interface InstagramPost {
    id: string;
    type: 'image' | 'video' | 'carousel';
    thumbnailUrl: string;
    mediaUrl: string;
    caption?: string;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: string;
    carouselItems?: Array<{
        type: 'image' | 'video';
        mediaUrl: string;
        thumbnailUrl: string;
    }>;
}
export interface InstagramMediaResult {
    profile: InstagramProfile;
    stories: InstagramStory[];
    highlights: InstagramHighlight[];
    posts: InstagramPost[];
}
//# sourceMappingURL=instagram.d.ts.map