require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// bring in all route files
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const subscriptionRoutes = require('./routes/subscriptions');
const socialRoutes = require('./routes/social');

const app = express();

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// connect to mongodb
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanhub';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// basic info route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FitPlanHub API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      plans: '/api/plans',
      subscriptions: '/api/subscriptions',
      social: '/api/follow, /api/following, /api/feed, /api/trainers'
    }
  });
});

// setup all routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/follow', socialRoutes);
app.use('/api/following', socialRoutes);
app.use('/api', socialRoutes); // for feed and trainers endpoints

// catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// global error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});

module.exports = app;