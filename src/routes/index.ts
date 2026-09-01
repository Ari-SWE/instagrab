import { Router } from 'express';
import { InstagramService } from '../services/instagramService';
import { healthController } from '../controllers/healthController';
import { createProfileController } from '../controllers/profileController';
import { createStoriesController } from '../controllers/storiesController';
import { createHighlightsController } from '../controllers/highlightsController';
import { createPostsController } from '../controllers/postsController';
import { createMediaController } from '../controllers/mediaController';
import { validateUsername } from '../middleware/validator';

export function createRouter(service: InstagramService): Router {
  const router = Router();

  // Health check
  router.get('/health', healthController);

  // Instagram endpoints — all require username validation
  router.get('/profile/:username', validateUsername, createProfileController(service));
  router.get('/stories/:username', validateUsername, createStoriesController(service));
  router.get('/highlights/:username', validateUsername, createHighlightsController(service));
  router.get('/posts/:username', validateUsername, createPostsController(service));
  router.get('/media/:username', validateUsername, createMediaController(service));

  return router;
}
