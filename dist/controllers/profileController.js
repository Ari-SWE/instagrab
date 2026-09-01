"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileController = createProfileController;
function createProfileController(service) {
    return async (req, res, next) => {
        try {
            const username = req.params.username;
            const result = await service.getAllMedia(username);
            res.json({
                success: true,
                data: {
                    profile: result.profile,
                    stories: result.stories,
                    highlights: result.highlights,
                    posts: result.posts,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=profileController.js.map