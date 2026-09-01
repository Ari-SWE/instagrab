import { Request, Response, NextFunction } from 'express';
/**
 * Middleware that validates and normalizes the :username route parameter.
 * After this middleware, req.params.username is guaranteed to be a clean, valid username.
 */
export declare function validateUsername(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=validator.d.ts.map