const express = require('express');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { authenticate, isTrainer } = require('../middleware/auth');

const router = express.Router();

// create new fitness plan - only trainers can do this
router.post('/', authenticate, isTrainer, async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    // validate required fields
    if (!title || !description || price === undefined || !duration) {
      return res.status(400).json({ 
        error: 'Please provide title, description, price, and duration' 
      });
    }

    // create the plan
    const newPlan = new Plan({
      title,
      description,
      price,
      duration,
      trainer: req.user._id // from authenticated user
    });

    await newPlan.save();

    // populate trainer details before sending response
    await newPlan.populate('trainer', 'name email');

    res.status(201).json({
      message: 'Plan created successfully',
      plan: newPlan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ 
      error: 'Error creating plan', 
      details: error.message 
    });
  }
});

// get all plans - different views for subscribed vs non-subscribed users
router.get('/', authenticate, async (req, res) => {
  try {
    // fetch all plans with trainer info
    const allPlans = await Plan.find()
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });

    // determine what data each user can see
    const plansWithAccess = allPlans.map(plan => {
      const hasSubscription = req.user.isSubscribedTo(plan._id);
      const isTrainerUser = req.user.role === 'trainer';
      
      // subscribers and trainers get full details
      if (hasSubscription || isTrainerUser) {
        return {
          ...plan.toObject(),
          hasAccess: true
        };
      } else {
        // non-subscribers only get preview
        return {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          trainer: {
            _id: plan.trainer._id,
            name: plan.trainer.name
          },
          hasAccess: false,
          message: 'Subscribe to view full details'
        };
      }
    });

    res.json({
      count: plansWithAccess.length,
      plans: plansWithAccess
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ 
      error: 'Error fetching plans', 
      details: error.message 
    });
  }
});

// get single plan details
router.get('/:planId', authenticate, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId)
      .populate('trainer', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // check access rights
    const hasSubscription = req.user.isSubscribedTo(plan._id);
    const isPlanOwner = plan.trainer._id.toString() === req.user._id.toString();

    if (!hasSubscription && !isPlanOwner) {
      // send preview only
      return res.status(403).json({ 
        error: 'Access denied. Subscribe to view full plan details.',
        preview: {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          trainer: {
            _id: plan.trainer._id,
            name: plan.trainer.name
          }
        }
      });
    }

    // user has access - send full details
    res.json({
      plan: {
        ...plan.toObject(),
        hasAccess: true
      }
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ 
      error: 'Error fetching plan', 
      details: error.message 
    });
  }
});

// update plan - trainer can only update their own plans
router.put('/:planId', authenticate, isTrainer, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // verify ownership
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'You can only update your own plans' 
      });
    }

    // update only provided fields
    const { title, description, price, duration } = req.body;
    
    if (title) plan.title = title;
    if (description) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (duration) plan.duration = duration;

    await plan.save();
    
    // populate and return updated plan
    await plan.populate('trainer', 'name email');

    res.json({
      message: 'Plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ 
      error: 'Error updating plan', 
      details: error.message 
    });
  }
});

// delete plan - trainer can only delete their own plans
router.delete('/:planId', authenticate, isTrainer, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // check if trainer owns this plan
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'You can only delete your own plans' 
      });
    }

    // delete the plan
    await Plan.findByIdAndDelete(req.params.planId);

    // cleanup: remove plan from user subscriptions
    await User.updateMany(
      { 'subscriptions.plan': req.params.planId },
      { $pull: { subscriptions: { plan: req.params.planId } } }
    );

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ 
      error: 'Error deleting plan', 
      details: error.message 
    });
  }
});

module.exports = router;