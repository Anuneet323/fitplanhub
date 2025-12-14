const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Plan description is required']
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Plan duration is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  // reference to trainer who created this plan
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// add indexes for better query performance
planSchema.index({ trainer: 1 });
planSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Plan', planSchema);