import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/types'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; // Ensure no further code runs
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User; // Assert type
    req.user = decoded; // Attach user to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return; // Ensure no further code runs
  }
};
