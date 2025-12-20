const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Shirt', 'Pant', 'Jacket', 'Accessories'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  images: [{
    type: String,
    required: true
  }],
  demoVideoLink: {
    type: String,
    default: null
  },
  paymentOptions: {
    type: [String],
    enum: ['Cash on Delivery', 'Pay First'],
    default: ['Cash on Delivery']
  },
  showOnHome: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

module.exports = mongoose.model('Product', productSchema);
