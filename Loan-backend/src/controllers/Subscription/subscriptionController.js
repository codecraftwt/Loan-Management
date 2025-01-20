const Subscription = require("../../models/Subscription");
const User = require("../../models/User");


const createSubscription = async (req, res) => {
    const { userId, subscriptionPlan } = req.body;

    if (!['trial', 'monthly', 'yearly'].includes(subscriptionPlan)) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user already has an active subscription
        const existingSubscription = await Subscription.findOne({ user: userId, isActive: true });
        if (existingSubscription) {
            return res.status(400).json({ message: 'User already has an active subscription' });
        }

        const subscriptionStart = new Date();
        let subscriptionExpiry;

        // Set subscription expiry based on plan
        if (subscriptionPlan === "trial") {
            subscriptionExpiry = new Date(subscriptionStart);
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 7); // Trial period for 7 days
        } else if (subscriptionPlan === "monthly") {
            subscriptionExpiry = new Date();
            subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1);
        } else if (subscriptionPlan === "yearly") {
            subscriptionExpiry = new Date();
            subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);
        }

        const subscription = new Subscription({
            user: userId,
            subscriptionPlan,
            subscriptionStart,
            subscriptionExpiry,
            isActive: true,  // Mark as active by default
        });

        await subscription.save();

        // Update user's subscription field
        user.subscription = subscription._id;
        await user.save();

        return res.status(201).json({
            message: 'Subscription created successfully',
            subscription,
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};


// Get User Subscription API
const getUserSubscription = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('subscription');
        if (!user || !user.subscription) {
            return res.status(404).json({ message: 'Subscription not found for this user' });
        }

        const subscription = user.subscription;
        const currentDate = new Date();

        if (currentDate > subscription.subscriptionExpiry) {
            if (subscription.subscriptionPlan === 'trial') {
                subscription.isActive = false; // Mark as expired
            }
            if (subscription.subscriptionPlan === 'monthly' || subscription.subscriptionPlan === 'yearly') {
                subscription.isActive = false;
            }
            await subscription.save();
        }

        return res.status(200).json({
            message: 'User subscription fetched successfully',
            subscription,
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};

module.exports = { createSubscription, getUserSubscription };
