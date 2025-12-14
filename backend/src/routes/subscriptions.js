const express = require('express');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// subscribe to a fitness plan
router.post('/:planId', authenticate, async (req, res) => {
  try {
    // check if plan exists
    const plan = await Plan.findById(req.params.planId)
      .populate('trainer', 'name email');

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // check if user already has this subscription
    if (req.user.isSubscribedTo(plan._id)) {
      return res.status(400).json({ 
        error: 'You are already subscribed to this plan' 
      });
    }

    // simulate payment processing here
    // in production, integrate Stripe/PayPal/etc
    const paymentInfo = {
      success: true,
      transactionId: `TXN${Date.now()}`,
      amount: plan.price,
      currency: 'USD'
    };

    // check if payment succeeded
    if (!paymentInfo.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // add plan to user's subscriptions
    req.user.subscriptions.push({
      plan: plan._id,
      subscribedAt: new Date()
    });

    await req.user.save();

    const latestSubscription = req.user.subscriptions[req.user.subscriptions.length - 1];

    res.status(201).json({
      message: 'Successfully subscribed to plan',
      subscription: {
        plan: {
          _id: plan._id,
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer
        },
        payment: paymentInfo,
        subscribedAt: latestSubscription.subscribedAt
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      error: 'Error processing subscription', 
      details: error.message 
    });
  }
});

// get all plans user has subscribed to
router.get('/', authenticate, async (req, res) => {
  try {
    // populate subscription details
    await req.user.populate({
      path: 'subscriptions.plan',
      populate: {
        path: 'trainer',
        select: 'name email'
      }
    });

    const userSubscriptions = req.user.subscriptions.map(sub => ({
      plan: sub.plan,
      subscribedAt: sub.subscribedAt
    }));

    res.json({
      count: userSubscriptions.length,
      subscriptions: userSubscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ 
      error: 'Error fetching subscriptions', 
      details: error.message 
    });
  }
});

// unsubscribe from a plan
router.delete('/:planId', authenticate, async (req, res) => {
  try {
    const planId = req.params.planId;

    // verify user has this subscription
    if (!req.user.isSubscribedTo(planId)) {
      return res.status(400).json({ 
        error: 'You are not subscribed to this plan' 
      });
    }

    // remove the subscription
    req.user.subscriptions = req.user.subscriptions.filter(
      sub => sub.plan.toString() !== planId
    );

    await req.user.save();

    res.json({ 
      message: 'Successfully unsubscribed from plan' 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ 
      error: 'Error unsubscribing from plan', 
      details: error.message 
    });
  }
});

module.exports = router;