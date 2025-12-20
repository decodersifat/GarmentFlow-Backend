const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const Order = require('../models/Order');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Get tracking by order ID
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const tracking = await Tracking.findOne({ orderId: req.params.orderId });

    if (!tracking) {
      return res.status(404).json({ message: 'Tracking not found' });
    }

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add tracking update (Manager)
router.post('/:orderId/update', authMiddleware, roleMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const { status, location, notes, image } = req.body;

    let tracking = await Tracking.findOne({ orderId: req.params.orderId });

    if (!tracking) {
      tracking = new Tracking({
        orderId: req.params.orderId,
        updates: []
      });
    }

    tracking.updates.push({
      status,
      location,
      notes,
      image,
      timestamp: new Date()
    });

    await tracking.save();

    res.status(201).json({ message: 'Tracking update added', tracking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
