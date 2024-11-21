import { Router } from 'express';
import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool } from '../config/database';
import { isAuthenticated } from '../middleware/auth';
import { User } from '../types/types';
import { mediaModel } from '../model/profiles';

const router = Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as User).id, email: (req.user as User).email , username: (req.user as User).username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
  }
);

router.get('/me', isAuthenticated, async (req, res, next) => {
  try {
    console.log('1');
    const [rows] = await pool.execute(
      'SELECT id, username, name, email, totalVisit, description FROM users WHERE id = ?',
      [(req.user as any).id]
    );

    console.log('2');
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const username = (req.user as any).username;

    const media = await mediaModel.findOne({ username: username });
    console.log('3');

    let profilePicture = null;
    if (media && media.profileImage) {
      profilePicture = `data:image/jpeg;base64,${Buffer.from(media.profileImage).toString('base64')}`;
    }

    console.log('4' ,{ ...rows[0], profilePicture});

    const responseData = {
      ...rows[0],
      profileImage: profilePicture,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    next(error); 
  }
});



export default router;