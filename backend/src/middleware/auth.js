const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware to check if request has valid JWT token
const authenticate = async (req, res, next) => {
  try {
    // extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // find user by id from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // attach user object to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

//  Trainer can create, edit, delete plans
const isTrainer = (req, res, next) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ error: 'Access denied. Trainers only.' });
  }
  next();
};

// Regular users can subscribe and follow trainers
const isRegularUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Access denied. Users only.' });
  }
  next();
};

module.exports = {
  authenticate,
  isTrainer,
  isRegularUser
};