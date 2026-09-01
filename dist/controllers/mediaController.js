"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMediaController = createMediaController;
function createMediaController(service) {
    return async (req, res, next) => {
        try {
            const username = req.params.username;
            const result = await service.getAllMedia(username);
            res.json({
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=mediaController.js.map