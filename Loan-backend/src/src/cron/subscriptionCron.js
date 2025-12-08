const cron = require('node-cron');
const User = require('../models/User');
// Uncomment if you have email service set up
// const { sendSubscriptionExpiryEmail } = require('../utils/mailer');

/**
 * Cron job to check for expired subscriptions once every day at midnight (00:00)
 * This job:
 * 1. Finds all users with expired subscriptions
 * 2. Marks them as inactive
 * 3. Updates their status to 'expired'
 * 4. Optionally sends expiration emails
 */
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        
        // Find all users with expired subscriptions that are still marked as active
        const expiredUsers = await User.find({
            isActive: true,
            status: 'active',
            paymentStatus: 'captured',
            endDate: { $lt: now } // Subscription end date is in the past
        });

        console.log(`Found ${expiredUsers.length} expired subscriptions to process.`);

        // Mark each expired subscription as inactive
        for (let user of expiredUsers) {
            user.isActive = false;
            user.status = 'expired';
            await user.save();

            // Optionally send expiration email (uncomment if email service is configured)
            // try {
            //     await sendSubscriptionExpiryEmail(
            //         user.email, 
            //         user.endDate.toDateString()
            //     );
            //     console.log(`Expiration email sent to ${user.email}`);
            // } catch (emailError) {
            //     console.error(`Failed to send email to ${user.email}:`, emailError);
            // }
        }

        console.log(`${expiredUsers.length} expired subscriptions were marked as inactive.`);
    } catch (error) {
        console.error('Error in subscription expiration cron job:', error);
    }
});

/**
 * Optional: Cron job to send expiration warnings
 * Runs daily at 9 AM to check for subscriptions expiring in 7 days
 */
cron.schedule('0 9 * * *', async () => {
    try {
        const now = new Date();
        const warningDate = new Date();
        warningDate.setDate(warningDate.getDate() + 7); // 7 days from now

        // Find users whose subscriptions expire in 7 days
        const expiringSoonUsers = await User.find({
            isActive: true,
            status: 'active',
            paymentStatus: 'captured',
            endDate: {
                $gte: now,
                $lte: warningDate
            }
        });

        console.log(`Found ${expiringSoonUsers.length} subscriptions expiring in 7 days.`);

        // Send warning emails (uncomment if email service is configured)
        // for (let user of expiringSoonUsers) {
        //     try {
        //         await sendSubscriptionExpiryEmail(
        //             user.email,
        //             user.endDate.toDateString(),
        //             true // isWarning = true
        //         );
        //     } catch (emailError) {
        //         console.error(`Failed to send warning email to ${user.email}:`, emailError);
        //     }
        // }
    } catch (error) {
        console.error('Error in subscription warning cron job:', error);
    }
});

console.log('Subscription cron jobs initialized:');
console.log('- Expiration check: Daily at 00:00');
console.log('- Expiration warnings: Daily at 09:00');

module.exports = cron;
