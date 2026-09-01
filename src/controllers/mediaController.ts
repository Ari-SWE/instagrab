import { Request, Response, NextFunction } from 'express';
import { InstagramService } from '../services/instagramService';

export function createMediaController(service: InstagramService) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const username = req.params.username as string;
      const result = await service.getAllMedia(username);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}
