"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostsController = createPostsController;
function createPostsController(service) {
    return async (req, res, next) => {
        try {
            const username = req.params.username;
            const posts = await service.getPosts(username);
            res.json({
                success: true,
                data: { posts },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=postsController.js.map