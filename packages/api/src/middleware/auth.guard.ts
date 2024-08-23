import { bearerSplitter } from '@/utils/bearerSplitter';
import Token from '@/utils/Token';
import { Request, Response, NextFunction } from 'express';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated = Token.verifyToken(
    bearerSplitter(req.headers.authorization || '')
  );

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
