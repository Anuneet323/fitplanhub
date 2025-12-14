const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// user schema - handles both regular users and trainers
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'trainer'],
    default: 'user'
  },
  // trainers that this user follows
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // plans user has subscribed to
  subscriptions: [{
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan'
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hash the password before saving to db
userSchema.pre('save', async function(next) {
  // only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// compare entered password with hashed password in db
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// check if user already subscribed to a specific plan
userSchema.methods.isSubscribedTo = function(planId) {
  return this.subscriptions.some(
    subscription => subscription.plan.toString() === planId.toString()
  );
};

// check if user is following a trainer
userSchema.methods.isFollowing = function(trainerId) {
  return this.following.some(
    id => id.toString() === trainerId.toString()
  );
};

module.exports = mongoose.model('User', userSchema);