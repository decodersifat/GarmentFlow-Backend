const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, photoURL, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      photoURL,
      role: role || 'buyer',
      status: 'pending',
      authProvider: 'email'
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie settings - secure only in production
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: isProduction ? 'none' : 'lax', // 'none' requires secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        photoURL,
        role: 'buyer',
        status: 'pending',
        authProvider: 'google'
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie settings - secure only in production
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: isProduction ? 'none' : 'lax', // 'none' requires secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GitHub OAuth Login
router.post('/github-login', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        photoURL,
        role: 'buyer',
        status: 'pending',
        authProvider: 'github'
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie settings - secure only in production
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS)
      sameSite: isProduction ? 'none' : 'lax', // 'none' requires secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    res.json({
      message: 'GitHub login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });
  res.json({ message: 'Logout successful' });
});

module.exports = router;
