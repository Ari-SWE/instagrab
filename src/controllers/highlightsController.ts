import { Request, Response, NextFunction } from 'express';
import { InstagramService } from '../services/instagramService';

export function createHighlightsController(service: InstagramService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = req.params.username as string;
      const highlights = await service.getHighlights(username);

      res.json({
        success: true,
        data: { highlights },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}
