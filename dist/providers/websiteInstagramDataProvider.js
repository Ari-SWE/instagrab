"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteInstagramDataProvider = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../utils/logger"));
const api_1 = require("../types/api");
class WebsiteInstagramDataProvider {
    name = 'WebsiteScraperProvider';
    browser = null;
    async getBrowser() {
        if (!this.browser || !this.browser.connected) {
            this.browser = await puppeteer_1.default.launch({
                headless: true,
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                ],
            });
            logger_1.default.info('Puppeteer browser launched with cloud container flags');
        }
        return this.browser;
    }
    async createPage() {
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        await page.setUserAgent(env_1.config.puppeteer.userAgent);
        await page.setViewport({ width: 1280, height: 800 });
        return page;
    }
    async getAllMedia(username) {
        const page = await this.createPage();
        try {
            logger_1.default.info(`Fetching data for @${username} via multi-provider scraper`);
            let capturedUserInfo = null;
            let capturedPosts = [];
            let capturedStories = [];
            let capturedHighlights = [];
            // Intercept API responses from storiesig
            page.on('response', async (res) => {
                const u = res.url();
                if (res.status() === 200) {
                    try {
                        if (u.includes('/api/v1/instagram/userInfo')) {
                            const json = await res.json();
                            capturedUserInfo = json.result?.[0]?.user || json.result?.user || json.user || json;
                            logger_1.default.info(`[storiesig] Captured userInfo for @${username}`);
                        }
                        else if (u.includes('/api/v1/instagram/postsV2')) {
                            const json = await res.json();
                            const edges = json.result?.edges || [];
                            capturedPosts = edges.map((e, idx) => {
                                const node = e.node || e;
                                const isVideo = node.is_video === true || node.__typename === 'GraphVideo';
                                const displayUrl = node.display_url || node.thumbnail_src || '';
                                const videoUrl = node.video_url || displayUrl;
                                return {
                                    id: node.id || node.shortcode || `post_${idx}`,
                                    type: isVideo ? 'video' : 'image',
                                    thumbnailUrl: displayUrl,
                                    mediaUrl: isVideo ? videoUrl : displayUrl,
                                    caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
                                    likesCount: node.edge_media_preview_like?.count || node.edge_liked_by?.count || 0,
                                    commentsCount: node.edge_media_to_comment?.count || 0,
                                    createdAt: node.taken_at_timestamp
                                        ? new Date(node.taken_at_timestamp * 1000).toISOString()
                                        : new Date().toISOString(),
                                };
                            });
                            logger_1.default.info(`[storiesig] Captured ${capturedPosts.length} posts for @${username}`);
                        }
                        else if (u.includes('/api/v1/instagram/stories')) {
                            const json = await res.json();
                            const list = json.result || json.data || [];
                            capturedStories = list.map((s, idx) => {
                                const isVideo = s.is_video === true || s.media_type === 2;
                                const candidates = s.image_versions2?.candidates || [];
                                const bestCandidate = candidates.length > 0
                                    ? candidates.reduce((best, c) => ((c.width || 0) > (best.width || 0) ? c : best), candidates[0])
                                    : null;
                                const rawUrl = s.video_url || s.display_url || bestCandidate?.url || '';
                                const thumb = bestCandidate?.url || s.image_versions2?.candidates?.[0]?.url || rawUrl;
                                return {
                                    id: s.id || `story_${idx}`,
                                    type: isVideo ? 'video' : 'image',
                                    thumbnailUrl: thumb,
                                    mediaUrl: rawUrl,
                                    createdAt: s.taken_at ? new Date(s.taken_at * 1000).toISOString() : new Date().toISOString(),
                                };
                            });
                            logger_1.default.info(`[storiesig] Captured ${capturedStories.length} stories for @${username}`);
                        }
                        else if (u.includes('/api/v1/instagram/highlights')) {
                            const json = await res.json();
                            const list = json.result || json.data || [];
                            capturedHighlights = list.map((h, idx) => {
                                const rawCover = h.cover_media?.cropped_image_version?.url ||
                                    h.cover_media?.image_versions2?.candidates?.[0]?.url ||
                                    h.cover_url ||
                                    '';
                                const rawItems = Array.isArray(h.items) ? h.items : (Array.isArray(h.media) ? h.media : []);
                                const parsedItems = rawItems.length > 0
                                    ? rawItems.map((item, iIdx) => {
                                        const isVideo = item.is_video === true || item.media_type === 2;
                                        const candidates = item.image_versions2?.candidates || [];
                                        const bestCandidate = candidates.length > 0
                                            ? candidates.reduce((best, c) => ((c.width || 0) > (best.width || 0) ? c : best), candidates[0])
                                            : null;
                                        const rawUrl = item.video_url || item.display_url || bestCandidate?.url || '';
                                        const thumb = bestCandidate?.url || item.image_versions2?.candidates?.[0]?.url || rawUrl;
                                        return {
                                            id: item.id || `${h.id || idx}_item_${iIdx}`,
                                            type: (isVideo ? 'video' : 'image'),
                                            thumbnailUrl: thumb,
                                            mediaUrl: rawUrl || thumb,
                                            createdAt: item.taken_at ? new Date(item.taken_at * 1000).toISOString() : new Date().toISOString(),
                                        };
                                    })
                                    : [
                                        {
                                            id: `${h.id || idx}_cover`,
                                            type: 'image',
                                            thumbnailUrl: rawCover,
                                            mediaUrl: rawCover,
                                            createdAt: new Date().toISOString(),
                                        },
                                    ];
                                return {
                                    id: h.id || `highlight_${idx}`,
                                    title: h.title || `Highlight ${idx + 1}`,
                                    coverUrl: rawCover,
                                    itemCount: h.media_count || parsedItems.length,
                                    items: parsedItems,
                                };
                            });
                            logger_1.default.info(`[storiesig] Captured ${capturedHighlights.length} highlights for @${username}`);
                        }
                    }
                    catch { }
                }
            });
            // Primary attempt: storiesig.info
            try {
                await page.goto(`https://storiesig.info/en7jr/`, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000,
                });
                await page.waitForSelector('input', { timeout: 20000 });
                await page.click('input');
                await page.type('input', username, { delay: 30 });
                await page.keyboard.press('Enter');
                // Also trigger search button if available
                await page.evaluate(() => {
                    const btn = document.querySelector('.search-form__button, button[type="submit"]');
                    if (btn)
                        btn.click();
                });
                // Dynamically wait for results / tabs to mount
                await page.waitForSelector('.tabs-component__tabs, .tabs-component__button, .profile-header', { timeout: 15000 }).catch(() => null);
                await new Promise((r) => setTimeout(r, 2000));
                // Click Stories tab explicitly (.tabs-component__button with exact text 'stories')
                await page.evaluate(() => {
                    const btns = Array.from(document.querySelectorAll('.tabs-component__button, [role="tab"] button, [role="tab"]'));
                    const btn = btns.find((b) => (b.textContent || '').trim().toLowerCase() === 'stories');
                    if (btn)
                        btn.click();
                });
                // Wait for stories API response
                await new Promise((r) => setTimeout(r, 3500));
                // Click Highlights tab explicitly (.tabs-component__button with exact text 'highlights')
                await page.evaluate(() => {
                    const btns = Array.from(document.querySelectorAll('.tabs-component__button, [role="tab"] button, [role="tab"]'));
                    const btn = btns.find((b) => (b.textContent || '').trim().toLowerCase() === 'highlights');
                    if (btn)
                        btn.click();
                });
                // Wait for highlights API response
                await new Promise((r) => setTimeout(r, 3500));
            }
            catch (err) {
                logger_1.default.warn(`storiesig extraction error: ${err.message}`);
            }
            // If storiesig succeeded in capturing userInfo
            if (capturedUserInfo) {
                const u = capturedUserInfo;
                const avatarThumbUrl = u.profile_pic_url || '';
                const hdAvatarUrl = u.hd_profile_pic_url_info?.url || u.profile_pic_url_hd || avatarThumbUrl;
                const profile = {
                    username: u.username || username,
                    displayName: u.full_name || u.username || username,
                    profilePictureUrl: avatarThumbUrl,
                    hdProfilePictureUrl: hdAvatarUrl,
                    isVerified: u.is_verified || false,
                    isPrivate: u.is_private || false,
                    bio: u.biography || '',
                    postsCount: u.media_count || capturedPosts.length,
                    followersCount: u.follower_count || 0,
                    followingCount: u.following_count || 0,
                };
                if (profile.isPrivate) {
                    throw api_1.Errors.privateAccount();
                }
                logger_1.default.info(`Successfully extracted @${username}: ${capturedPosts.length} posts, ${capturedStories.length} stories, ${capturedHighlights.length} highlights`);
                return {
                    profile,
                    stories: capturedStories,
                    highlights: capturedHighlights,
                    posts: capturedPosts,
                };
            }
            // Fallback: insta-stories-viewer.com
            logger_1.default.info(`Falling back to insta-stories-viewer.com for @${username}`);
            const targetUrl = `https://insta-stories-viewer.com/en/${encodeURIComponent(username)}/`;
            await page.goto(targetUrl, {
                waitUntil: 'domcontentloaded',
                timeout: env_1.config.puppeteer.timeout,
            });
            const notFoundVisible = await page.evaluate(`
        (() => {
          const el = document.querySelector('.profile__stories-not-found, .profile__posts-not-found');
          return el ? getComputedStyle(el).display !== 'none' : false;
        })()
      `);
            if (notFoundVisible)
                throw api_1.Errors.userNotFound();
            const isPrivate = await page.evaluate(`
        (() => {
          const el = document.querySelector('.profile__stories-is-private, .profile__posts-is-private');
          return el ? getComputedStyle(el).display !== 'none' : false;
        })()
      `);
            if (isPrivate)
                throw api_1.Errors.privateAccount();
            // Extract profile details
            const rawProfile = (await page.evaluate(`
        (() => {
          const avatarEl = document.querySelector('.profile__avatar-pic');
          const nicknameEl = document.querySelector('.profile__nickname');
          const verifiedEl = document.querySelector('.profile__nickname-is-verify');
          const descEl = document.querySelector('.profile__description');

          const statsEls = document.querySelectorAll('.profile__stats-item-value');
          const postsStr = (statsEls[0] && statsEls[0].textContent) ? statsEls[0].textContent.trim() : '0';
          const followersStr = (statsEls[1] && statsEls[1].textContent) ? statsEls[1].textContent.trim() : '0';
          const followingStr = (statsEls[2] && statsEls[2].textContent) ? statsEls[2].textContent.trim() : '0';

          const parseCount = (s) => {
            s = s.replace(/,/g, '');
            const mults = { K: 1000, M: 1000000, B: 1000000000 };
            const m = s.match(/^([\\\\d.]+)([KMB])?$/i);
            if (m) {
              const num = parseFloat(m[1]);
              const mult = m[2] ? (mults[m[2].toUpperCase()] || 1) : 1;
              return Math.round(num * mult);
            }
            return parseInt(s, 10) || 0;
          };

          const avatarSrc = avatarEl ? (avatarEl.getAttribute('data-src') || avatarEl.src || '') : '';

          return {
            username: "${username}",
            displayName: nicknameEl ? (nicknameEl.textContent || '').trim().split('\\\\n')[0].trim() : "${username}",
            profilePictureUrl: avatarSrc,
            hdProfilePictureUrl: avatarSrc,
            isVerified: !!verifiedEl && (verifiedEl.innerHTML || '').trim().length > 0,
            isPrivate: false,
            bio: descEl ? (descEl.textContent || '').trim() : '',
            postsCount: parseCount(postsStr),
            followersCount: parseCount(followersStr),
            followingCount: parseCount(followingStr),
          };
        })()
      `));
            const profile = {
                ...rawProfile,
                hdProfilePictureUrl: rawProfile.profilePictureUrl,
            };
            // Extract stories from fallback
            const stories = (await page.evaluate(`
        (() => {
          const results = [];
          const items = document.querySelectorAll('[data-tab="profile__tabs-stories"] .profile__tabs-media-item, .profile__stories .profile__tabs-media-item');
          
          items.forEach((item, index) => {
            const img = item.querySelector('img');
            const link = item.querySelector('.profile__tabs-media-item-link, .show-modal, a');
            const mediaType = link ? link.getAttribute('data-media-type') : null;
            const contentUrl = link ? (link.getAttribute('data-content') || link.getAttribute('href')) : null;
            const id = link ? (link.getAttribute('data-id') || ('story_' + index)) : ('story_' + index);

            const isVideo = mediaType === 'video' || item.querySelector('.profile__tabs-media-item-video-ico, .ico-video') !== null;
            const thumbUrl = img ? (img.getAttribute('data-src') || img.src || '') : '';
            const mediaUrl = contentUrl || thumbUrl;

            if (thumbUrl || mediaUrl) {
              results.push({
                id: id,
                type: isVideo ? 'video' : 'image',
                thumbnailUrl: thumbUrl || mediaUrl,
                mediaUrl: mediaUrl,
                createdAt: new Date().toISOString(),
              });
            }
          });
          return results;
        })()
      `));
            // Click posts tab
            let posts = [];
            try {
                await page.evaluate(`
          (() => {
            const btn = document.querySelector('li[data-content-type="posts"] a, li[data-content-type="posts"], [data-tab="profile__tabs-posts"] a');
            if (btn) btn.click();
          })()
        `);
                await new Promise((r) => setTimeout(r, 4000));
                posts = (await page.evaluate(`
          (() => {
            const results = [];
            const items = document.querySelectorAll('[data-tab="profile__tabs-posts"] .profile__tabs-media-item');
            
            items.forEach((item, index) => {
              const img = item.querySelector('img');
              const link = item.querySelector('.profile__tabs-media-item-link, .show-modal, a');
              const mediaType = link ? link.getAttribute('data-media-type') : null;
              const contentUrl = link ? (link.getAttribute('data-content') || link.getAttribute('href')) : null;
              const id = link ? (link.getAttribute('data-id') || ('post_' + index)) : ('post_' + index);

              const isVideo = mediaType === 'video' || item.querySelector('.profile__tabs-media-item-video-ico, .ico-video') !== null;
              const thumbUrl = img ? (img.getAttribute('data-src') || img.src || '') : '';
              const mediaUrl = contentUrl || thumbUrl;

              if (thumbUrl || mediaUrl) {
                results.push({
                  id: id,
                  type: isVideo ? 'video' : 'image',
                  thumbnailUrl: thumbUrl || mediaUrl,
                  mediaUrl: mediaUrl,
                  caption: '',
                  likesCount: 0,
                  commentsCount: 0,
                  createdAt: new Date().toISOString(),
                });
              }
            });
            return results;
          })()
        `));
            }
            catch { }
            // Extract highlights from fallback if not already captured
            let finalHighlights = capturedHighlights;
            if (finalHighlights.length === 0) {
                try {
                    const fallbackHighlights = (await page.evaluate(`
            (() => {
              const results = [];
              const items = document.querySelectorAll('.profile__highlights-item, [data-tab="profile__tabs-highlights"] .profile__tabs-media-item, .stories-highlights .item');
              items.forEach((item, index) => {
                const img = item.querySelector('img');
                const titleEl = item.querySelector('.profile__highlights-title, .title, span');
                const link = item.querySelector('a, .show-modal');
                const cover = img ? (img.getAttribute('data-src') || img.src || '') : '';
                const title = titleEl ? (titleEl.textContent || '').trim() : ('Highlight ' + (index + 1));
                const contentUrl = link ? (link.getAttribute('data-content') || link.getAttribute('href') || cover) : cover;
                if (cover || contentUrl) {
                  results.push({
                    id: 'highlight_' + index,
                    title: title || ('Highlight ' + (index + 1)),
                    coverUrl: cover || contentUrl,
                    itemCount: 1,
                    items: [
                      {
                        id: 'highlight_' + index + '_item_0',
                        type: 'image',
                        thumbnailUrl: cover,
                        mediaUrl: contentUrl || cover,
                        createdAt: new Date().toISOString(),
                      }
                    ]
                  });
                }
              });
              return results;
            })()
          `));
                    if (fallbackHighlights && fallbackHighlights.length > 0) {
                        finalHighlights = fallbackHighlights;
                    }
                }
                catch { }
            }
            return {
                profile,
                stories,
                highlights: finalHighlights,
                posts,
            };
        }
        catch (err) {
            logger_1.default.error(`Failed to scrape Instagram media: ${err.message}`);
            if (err.statusCode)
                throw err;
            throw api_1.Errors.upstreamUnavailable();
        }
        finally {
            await page.close().catch(() => { });
        }
    }
    async getProfile(username) {
        const result = await this.getAllMedia(username);
        return result.profile;
    }
    async getStories(username) {
        const result = await this.getAllMedia(username);
        return result.stories;
    }
    async getHighlights(username) {
        const result = await this.getAllMedia(username);
        return result.highlights;
    }
    async getPosts(username) {
        const result = await this.getAllMedia(username);
        return result.posts;
    }
    async destroy() {
        if (this.browser) {
            await this.browser.close().catch(() => { });
            this.browser = null;
        }
    }
}
exports.WebsiteInstagramDataProvider = WebsiteInstagramDataProvider;
//# sourceMappingURL=websiteInstagramDataProvider.js.map