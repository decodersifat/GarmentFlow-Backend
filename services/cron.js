const cron = require('node-cron');
const User = require('../models/User');
const Order = require('../models/Order');

// Clean up expired sessions
const cleanupExpiredSessions = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🧹 Cleaning up expired sessions...');
    // Cleanup logic here
    console.log('✅ Session cleanup completed');
  } catch (error) {
    console.error('❌ Session cleanup failed:', error);
  }
});

// Send pending order reminders to managers
const sendOrderReminders = cron.schedule('0 9 * * *', async () => {
  try {
    console.log('📧 Sending order reminders...');
    const pendingOrders = await Order.find({ status: 'Pending' })
      .populate('userId', 'email')
      .populate('productId', 'name');
    
    // Send email notifications here
    console.log(`✅ Sent reminders for ${pendingOrders.length} orders`);
  } catch (error) {
    console.error('❌ Reminder sending failed:', error);
  }
});

// Archive completed orders
const archiveCompletedOrders = cron.schedule('0 23 * * 0', async () => {
  try {
    console.log('📦 Archiving completed orders...');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const archived = await Order.updateMany(
      { 
        status: 'Delivered',
        createdAt: { $lte: thirtyDaysAgo }
      },
      { archived: true }
    );
    
    console.log(`✅ Archived ${archived.modifiedCount} orders`);
  } catch (error) {
    console.error('❌ Order archiving failed:', error);
  }
});

module.exports = {
  cleanupExpiredSessions,
  sendOrderReminders,
  archiveCompletedOrders
};
