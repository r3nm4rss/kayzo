import { NextFunction, Request, Response } from 'express';
import { pool } from '../config/database';
import { Link, User } from '../types/types';

export const createLink = async (req: Request, res: Response) => {
  try {
    const { userId, title, url } = req.body;

    // Get the highest order number for this user
    const [orderResult] = await pool.execute(
      'SELECT MAX(`order`) as maxOrder FROM links WHERE userId = ?',
      [userId]
    );
    const maxOrder = Array.isArray(orderResult) && orderResult[0] ?
      (orderResult[0] as any).maxOrder || 0 : 0;

    const [result] = await pool.execute(
      'INSERT INTO links (userId, title, url, `order`) VALUES (?, ?, ?, ?)',
      [userId, title, url, maxOrder + 1]
    );

    res.status(201).json({ message: 'Link created successfully', id: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLinks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [links] = await pool.execute(
      'SELECT * FROM links WHERE userId = ? ORDER BY `order` ASC',
      [userId]
    );

    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;

    const [result] = await pool.execute(
      'UPDATE links SET title = ?, url = ? WHERE id = ? AND userId = ?',
      [title, url, id, (req.user as User).id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Link not found or unauthorized' });
      return; // Prevent further execution
    }

    res.json({ message: 'Link updated successfully' });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM links WHERE id = ? AND userId = ?',
      [id, (req.user as User).id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Link not found or unauthorized' });
      return; // Prevent further execution
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export const reorderLinks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { linkIds } = req.body; // Array of link IDs in new order

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update order for each link
      for (let i = 0; i < linkIds.length; i++) {
        await connection.execute(
          'UPDATE links SET `order` = ? WHERE id = ? AND userId = ?',
          [i + 1, linkIds[i], userId]
        );
      }

      await connection.commit();
      res.json({ message: 'Links reordered successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};