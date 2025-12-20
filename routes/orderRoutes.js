const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Tracking = require('../models/Tracking');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, firstName, lastName, contactNumber, deliveryAddress, additionalNotes, paymentMethod } = req.body;
    const user = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity < product.minimumOrderQuantity) {
      return res.status(400).json({ message: `Minimum order quantity is ${product.minimumOrderQuantity}` });
    }

    if (quantity > product.availableQuantity) {
      return res.status(400).json({ message: `Only ${product.availableQuantity} items available` });
    }

    const orderId = `ORD-${Date.now()}`;
    const totalPrice = product.price * quantity;

    const order = new Order({
      orderId,
      userId: user.id,
      productId,
      productTitle: product.name,
      quantity,
      unitPrice: product.price,
      totalPrice,
      firstName,
      lastName,
      email: user.email,
      contactNumber,
      deliveryAddress,
      additionalNotes,
      paymentMethod,
      status: 'Pending'
    });

    await order.save();

    // Create tracking document
    const tracking = new Tracking({
      orderId: order._id,
      updates: [{
        status: 'Pending',
        location: 'Warehouse',
        notes: 'Order placed',
        timestamp: new Date()
      }]
    });
    await tracking.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
router.get('/user/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('productId', 'name category');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin)
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { status, limit = 10, skip = 0 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('productId', 'name category')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    res.json({ total, limit: parseInt(limit), skip: parseInt(skip), orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order details
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('userId productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const tracking = await Tracking.findOne({ orderId: order._id });

    res.json({ order, tracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve order (Manager)
router.patch('/:orderId/approve', authMiddleware, roleMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Approved', approvedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order approved', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject order (Manager)
router.patch('/:orderId/reject', authMiddleware, roleMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: 'Rejected', rejectedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order rejected', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (Buyer)
router.patch('/:orderId/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
