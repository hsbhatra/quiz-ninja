import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // 2. Extract token
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach user object to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Continue to route handler
      next();
    } catch (err) {
      console.error('Auth Middleware Error:', err);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }
};
