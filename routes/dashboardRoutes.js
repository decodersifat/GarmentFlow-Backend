const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendSuccess, sendError } = require('../utils/response');

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'admin') {
      const totalUsers = await User.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const approvedUsers = await User.countDocuments({ status: 'approved' });

      stats = {
        totalUsers,
        totalOrders,
        totalProducts,
        approvedUsers,
        pendingApprovals: totalUsers - approvedUsers
      };
    } else if (userRole === 'manager') {
      const myProducts = await Product.countDocuments({ createdBy: userId });
      const pendingOrders = await Order.countDocuments({ status: 'Pending' });
      const completedOrders = await Order.countDocuments({ status: 'Delivered' });

      stats = {
        myProducts,
        pendingOrders,
        completedOrders,
        activeOrders: pendingOrders
      };
    } else if (userRole === 'buyer') {
      const myOrders = await Order.countDocuments({ userId });
      const pendingOrders = await Order.countDocuments({ userId, status: 'Pending' });
      const completedOrders = await Order.countDocuments({ userId, status: 'Delivered' });

      stats = {
        myOrders,
        pendingOrders,
        completedOrders
      };
    }

    sendSuccess(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to fetch statistics', 500, error);
  }
});

// Get recent activity
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('productId', 'name price')
      .select('status createdAt totalPrice quantity');

    sendSuccess(res, orders, 'Recent activity retrieved');
  } catch (error) {
    sendError(res, 'Failed to fetch activity', 500, error);
  }
});

module.exports = router;
