const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Export orders to CSV format
const exportOrdersToCSV = async (filters = {}) => {
  try {
    const orders = await Order.find(filters)
      .populate('userId', 'name email')
      .populate('productId', 'name price category')
      .lean();

    // CSV Header
    let csv = 'Order ID,Customer,Email,Product,Quantity,Unit Price,Total,Status,Date\n';

    // CSV Rows
    orders.forEach(order => {
      const row = [
        order.orderId,
        order.userId?.name || 'N/A',
        order.userId?.email || 'N/A',
        order.productId?.name || 'N/A',
        order.quantity,
        order.unitPrice,
        order.totalPrice,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ].map(cell => `"${cell}"`).join(',');
      csv += row + '\n';
    });

    return csv;
  } catch (error) {
    throw error;
  }
};

// Export products to JSON
const exportProductsToJSON = async (filters = {}) => {
  try {
    const products = await Product.find(filters)
      .populate('createdBy', 'name email')
      .lean();

    return JSON.stringify(products, null, 2);
  } catch (error) {
    throw error;
  }
};

// Generate analytics report
const generateAnalyticsReport = async (startDate, endDate) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
        deliveredOrders,
        pendingOrders,
        deliveryRate: totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(2) : 0
      },
      ordersByStatus: {
        pending: pendingOrders,
        approved: orders.filter(o => o.status === 'Approved').length,
        rejected: orders.filter(o => o.status === 'Rejected').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length,
        delivered: deliveredOrders
      },
      generatedAt: new Date()
    };
  } catch (error) {
    throw error;
  }
};

// Export user data (for GDPR compliance)
const exportUserData = async (userId) => {
  try {
    const user = await User.findById(userId).lean();
    const orders = await Order.find({ userId }).lean();
    const reviews = []; // Add review export if applicable

    return {
      user,
      orders,
      reviews,
      exportDate: new Date(),
      dataController: 'GarmentFlow'
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  exportOrdersToCSV,
  exportProductsToJSON,
  generateAnalyticsReport,
  exportUserData
};
