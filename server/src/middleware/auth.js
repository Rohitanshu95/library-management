import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Verify JWT token and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Official authentication token missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret_key_institute_platform_2026');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Candidate/Staff record not found.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account access has been suspended by administration.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.',
    });
  }
};

// Role-Based Access Control Guard
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to authorized roles [${allowedRoles.join(', ')}]. Current role: ${req.user?.role || 'Guest'}`,
      });
    }
    next();
  };
};
