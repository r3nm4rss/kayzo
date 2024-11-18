import { Router } from 'express';
import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool } from '../config/database';
import { isAuthenticated } from '../middleware/auth';
import { User } from '../types/types';

const router = Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as User).id, email: (req.user as User).email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
  }
);

router.get('/me', isAuthenticated, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, name, email, profilePicture FROM users WHERE id = ?',
      [(req.user as any).id] // Adjust `any` to the appropriate type if needed
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return; // Ensure no further code runs
    }

    res.json(rows[0]); // Send the user data
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
});


export default router;