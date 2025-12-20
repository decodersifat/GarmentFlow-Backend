const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  updates: [{
    status: {
      type: String,
      enum: ['Cutting Completed', 'Sewing Started', 'Finishing', 'QC Checked', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);
