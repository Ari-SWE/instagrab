"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoriesController = createStoriesController;
function createStoriesController(service) {
    return async (req, res, next) => {
        try {
            const username = req.params.username;
            const stories = await service.getStories(username);
            res.json({
                success: true,
                data: { stories },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=storiesController.js.map