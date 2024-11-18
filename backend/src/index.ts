import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import userRoutes from './routes/userRoutes';
import linkRoutes from "./routes/linkRoutes"
import authRoutes from './routes/authRoutes';
import './config/passport';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(3000, () => {
  console.log(`Server is running `);
});