"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const profileController_1 = require("../controllers/profileController");
const storiesController_1 = require("../controllers/storiesController");
const highlightsController_1 = require("../controllers/highlightsController");
const postsController_1 = require("../controllers/postsController");
const mediaController_1 = require("../controllers/mediaController");
const validator_1 = require("../middleware/validator");
function createRouter(service) {
    const router = (0, express_1.Router)();
    // Health check
    router.get('/health', healthController_1.healthController);
    // Instagram endpoints — all require username validation
    router.get('/profile/:username', validator_1.validateUsername, (0, profileController_1.createProfileController)(service));
    router.get('/stories/:username', validator_1.validateUsername, (0, storiesController_1.createStoriesController)(service));
    router.get('/highlights/:username', validator_1.validateUsername, (0, highlightsController_1.createHighlightsController)(service));
    router.get('/posts/:username', validator_1.validateUsername, (0, postsController_1.createPostsController)(service));
    router.get('/media/:username', validator_1.validateUsername, (0, mediaController_1.createMediaController)(service));
    return router;
}
//# sourceMappingURL=index.js.map