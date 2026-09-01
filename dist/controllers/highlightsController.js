"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHighlightsController = createHighlightsController;
function createHighlightsController(service) {
    return async (req, res, next) => {
        try {
            const username = req.params.username;
            const highlights = await service.getHighlights(username);
            res.json({
                success: true,
                data: { highlights },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=highlightsController.js.map