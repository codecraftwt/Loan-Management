const express = require('express');
const { 
  createSubscriptionOrder, 
  verifyPaymentAndActivateSubscription,
  getUserActiveSubscription,
  testPurchaseSubscription
} = require('../controllers/Subscriptions/SubscriptionController');
const authenticateUser = require('../middlewares/authenticateUser');

const router = express.Router();

// Route to create subscription order
router.post('/create-subscription', authenticateUser, createSubscriptionOrder);

// Route to verify payment and activate subscription
router.post('/verify-payment', authenticateUser, verifyPaymentAndActivateSubscription);

// Route to get user subscription
router.get('/get-subscription', authenticateUser, getUserActiveSubscription);

// Route to test subscription purchase (without actual payment - for testing)
router.post('/test-purchase', authenticateUser, testPurchaseSubscription);

module.exports = router;
        