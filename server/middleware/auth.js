const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Basic authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Handle superadmin case (userId is 'superadmin' string, not ObjectId)
    if (decoded.userId === 'superadmin') {
      req.user = {
        _id: 'superadmin',
        username: decoded.username,
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@euroshub.com',
        isActive: true
      };
      return next();
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Specific role middlewares for convenience
const requireSuperAdmin = authorize('superadmin');
const requireAdmin = authorize('superadmin', 'admin');
const requireHR = authorize('superadmin', 'admin', 'hr');
const requireClient = authorize('superadmin', 'admin', 'client');
const requireEmployee = authorize('superadmin', 'admin', 'hr', 'employee');

module.exports = {
  auth,
  authorize,
  requireSuperAdmin,
  requireAdmin,
  requireHR,
  requireClient,
  requireEmployee
};