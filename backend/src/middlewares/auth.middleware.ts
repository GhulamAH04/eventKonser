import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// extend Request supaya bisa punya user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware untuk verifikasi token
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

    req.user = decoded; // simpan payload token ke request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware untuk memverifikasi token dan role
export const verifyTokenAndRole = (role: 'user' | 'organizer') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

      // Memeriksa role user
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }

      req.user = decoded; // simpan user ke request
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};
