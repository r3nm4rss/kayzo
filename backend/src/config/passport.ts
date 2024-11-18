import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from './database';
import { User } from '../types/types';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE googleId = ?',
        [profile.id]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return done(null, rows[0] as User);
      }

      const [result] = await pool.execute(
        `INSERT INTO users (googleId, email, name) VALUES (?, ?, ?)`,
        [profile.id, profile.emails![0].value, profile.displayName]
      );

      const [newUser] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [(result as any).insertId]
      );

      return done(null, (Array.isArray(newUser) ? newUser[0] : null) as User);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    done(null, Array.isArray(rows) ? rows[0] as User : null);
  } catch (error) {
    done(error, null);
  }
});
