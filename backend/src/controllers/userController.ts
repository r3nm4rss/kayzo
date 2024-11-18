import { NextFunction, Request, Response } from 'express';
import { pool } from '../config/database';
import { User } from '../types/types';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, name, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      res.status(400).json({ message: 'Username already taken' });
      return; // Exit early
    }

    const profilePicture = files.profilePicture ? files.profilePicture[0].filename : null;
    const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].filename : null;
    const backgroundType = files.backgroundMedia
      ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
      : null;

    await pool.execute(
      `INSERT INTO users (username, name, description, profilePicture, backgroundMedia, backgroundType)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, name, description, profilePicture, backgroundMedia, backgroundType]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};




export const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit early
    }

    res.json(rows[0]);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};




export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const { name, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const [user] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (!Array.isArray(user) || user.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit early
    }

    const profilePicture = files.profilePicture ? files.profilePicture[0].filename : undefined;
    const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].filename : undefined;
    const backgroundType = files.backgroundMedia
      ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
      : undefined;

    let updateQuery = 'UPDATE users SET name = ?, description = ?';
    const params = [name, description];

    if (profilePicture) {
      updateQuery += ', profilePicture = ?';
      params.push(profilePicture);
    }

    if (backgroundMedia) {
      updateQuery += ', backgroundMedia = ?, backgroundType = ?';
      params.push(backgroundMedia, backgroundType);
    }

    updateQuery += ' WHERE username = ?';
    params.push(username);

    await pool.execute(updateQuery, params);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM users WHERE username = ?',
      [username]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return; // Exit early
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
