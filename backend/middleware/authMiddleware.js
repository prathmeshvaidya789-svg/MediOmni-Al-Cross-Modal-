import jwt from 'jsonwebtoken';
import storageService from '../services/storageService.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token missing.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'multimodal_super_secure_jwt_secret_dev_key_2026_x89q';
    const decoded = jwt.verify(token, secret);

    // Retrieve user without password
    const user = await storageService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError' ? 'Token expired. Please login again.' : 'Invalid token.',
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
