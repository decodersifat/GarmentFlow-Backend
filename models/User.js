const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: null // For OAuth users
  },
  photoURL: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'buyer'],
    default: 'buyer'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'suspended'],
    default: 'pending'
  },
  suspendReason: {
    type: String,
    default: null
  },
  suspendFeedback: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
