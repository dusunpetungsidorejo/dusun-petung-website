import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password are required'
      });
    }

    // Retrieve user from database
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ? LIMIT 1',
      args: [username]
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Generate JWT Token (valid for 24 hours)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with structure matching Endpoint List.md
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        display_name: user.display_name,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};
