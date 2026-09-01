import { Request, Response, NextFunction } from 'express';

export function healthController(_req: Request, res: Response, _next: NextFunction): void {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
}
