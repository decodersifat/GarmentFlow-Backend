const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getRevenueStats = async (startDate, endDate) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'Delivered'
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
    };
  } catch (error) {
    throw error;
  }
};

const getOrderStats = async () => {
  try {
    const statuses = {};
    const orders = await Order.find().select('status');

    orders.forEach(order => {
      statuses[order.status] = (statuses[order.status] || 0) + 1;
    });

    return statuses;
  } catch (error) {
    throw error;
  }
};

const getPopularProducts = async (limit = 5) => {
  try {
    const products = await Order.aggregate([
      {
        $group: {
          _id: '$productId',
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    return products;
  } catch (error) {
    throw error;
  }
};

const getManagerPerformance = async (managerId) => {
  try {
    const products = await Product.countDocuments({ createdBy: managerId });
    const orders = await Order.countDocuments({ 
      productId: { $in: await Product.find({ createdBy: managerId }).select('_id') }
    });
    
    const deliveredOrders = await Order.countDocuments({
      productId: { $in: await Product.find({ createdBy: managerId }).select('_id') },
      status: 'Delivered'
    });

    return {
      totalProducts: products,
      totalOrders: orders,
      deliveredOrders,
      deliveryRate: orders > 0 ? ((deliveredOrders / orders) * 100).toFixed(2) : 0
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRevenueStats,
  getOrderStats,
  getPopularProducts,
  getManagerPerformance
};
