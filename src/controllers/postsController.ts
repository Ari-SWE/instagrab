import { Request, Response, NextFunction } from 'express';
import { InstagramService } from '../services/instagramService';

export function createPostsController(service: InstagramService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = req.params.username as string;
      const posts = await service.getPosts(username);

      res.json({
        success: true,
        data: { posts },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}
