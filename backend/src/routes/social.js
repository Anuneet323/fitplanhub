const express = require('express');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// follow a trainer
router.post('/:trainerId', authenticate, async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    // users can't follow themselves
    if (trainerId === req.user._id.toString()) {
      return res.status(400).json({ 
        error: 'You cannot follow yourself' 
      });
    }

    // verify trainer exists
    const trainerToFollow = await User.findById(trainerId);
    if (!trainerToFollow) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    // make sure it's actually a trainer
    if (trainerToFollow.role !== 'trainer') {
      return res.status(400).json({ 
        error: 'You can only follow trainers' 
      });
    }

    // check if already following
    if (req.user.isFollowing(trainerId)) {
      return res.status(400).json({ 
        error: 'You are already following this trainer' 
      });
    }

    // add trainer to following list
    req.user.following.push(trainerId);
    await req.user.save();

    res.json({
      message: 'Successfully followed trainer',
      trainer: {
        id: trainerToFollow._id,
        name: trainerToFollow.name,
        email: trainerToFollow.email
      }
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ 
      error: 'Error following trainer', 
      details: error.message 
    });
  }
});

// unfollow a trainer
router.delete('/:trainerId', authenticate, async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    // check if user is following this trainer
    if (!req.user.isFollowing(trainerId)) {
      return res.status(400).json({ 
        error: 'You are not following this trainer' 
      });
    }

    // remove from following list
    req.user.following = req.user.following.filter(
      id => id.toString() !== trainerId
    );
    
    await req.user.save();

    res.json({ 
      message: 'Successfully unfollowed trainer' 
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ 
      error: 'Error unfollowing trainer', 
      details: error.message 
    });
  }
});

// get list of trainers user is following
router.get('/', authenticate, async (req, res) => {
  try {
    // populate following list with trainer details
    await req.user.populate('following', 'name email role');

    const followedTrainers = req.user.following.map(trainer => ({
      id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role
    }));

    res.json({
      count: followedTrainers.length,
      trainers: followedTrainers
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ 
      error: 'Error fetching followed trainers', 
      details: error.message 
    });
  }
});

// get personalized feed of plans from followed trainers
router.get('/feed', authenticate, async (req, res) => {
  try {
    // get plans only from trainers user follows
    const feedPlans = await Plan.find({ 
      trainer: { $in: req.user.following } 
    })
    .populate('trainer', 'name email')
    .sort({ createdAt: -1 });

    // add purchase status to each plan
    const personalizedFeed = feedPlans.map(plan => {
      const hasPurchased = req.user.isSubscribedTo(plan._id);
      
      return {
        _id: plan._id,
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        trainer: {
          _id: plan.trainer._id,
          name: plan.trainer.name,
          email: plan.trainer.email
        },
        isPurchased: hasPurchased,
        createdAt: plan.createdAt
      };
    });

    res.json({
      count: personalizedFeed.length,
      feed: personalizedFeed
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ 
      error: 'Error fetching feed', 
      details: error.message 
    });
  }
});

// get all trainers for discovery
router.get('/trainers', authenticate, async (req, res) => {
  try {
    // find all users with trainer role
    const allTrainers = await User.find({ role: 'trainer' })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    // add follow status for current user
    const trainersWithStatus = allTrainers.map(trainer => ({
      id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      isFollowing: req.user.isFollowing(trainer._id),
      createdAt: trainer.createdAt
    }));

    res.json({
      count: trainersWithStatus.length,
      trainers: trainersWithStatus
    });
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ 
      error: 'Error fetching trainers', 
      details: error.message 
    });
  }
});

module.exports = router;