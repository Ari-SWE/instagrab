import { Request, Response, NextFunction } from 'express';
import { InstagramService } from '../services/instagramService';

export function createProfileController(service: InstagramService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = req.params.username as string;
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
    } catch (error) {
      next(error);
    }
  };
}
