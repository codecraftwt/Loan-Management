const express = require('express');
const { createSubscription, getUserSubscription } = require('../controllers/Subscription/subscriptionController');

const router = express.Router();

// Route to create subscription
router.post('/create-subscription', createSubscription);

// Route to get user subscription
router.get('/get-subscription/:userId', getUserSubscription);

module.exports = router;
        