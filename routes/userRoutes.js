const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Get all users (Admin)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { role, status, limit = 10, skip = 0 } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    res.json({ total, limit: parseInt(limit), skip: parseInt(skip), users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/current/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (Admin)
router.patch('/:userId/role', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve user (Admin)
router.patch('/:userId/approve', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'approved', suspendReason: null, suspendFeedback: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suspend user (Admin)
router.patch('/:userId/suspend', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { suspendReason, suspendFeedback } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'suspended', suspendReason, suspendFeedback },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User suspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
