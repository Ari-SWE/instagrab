import { Request, Response, NextFunction } from 'express';
import { InstagramService } from '../services/instagramService';

export function createStoriesController(service: InstagramService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = req.params.username as string;
      const stories = await service.getStories(username);

      res.json({
        success: true,
        data: { stories },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}
