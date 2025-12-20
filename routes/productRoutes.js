const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateProductInput } = require('../middleware/validators');

// Get all products with advanced filters
router.get('/', async (req, res) => {
  try {
    const { category, sortBy, minPrice, maxPrice, search, limit = 10, skip = 0 } = req.query;
    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sortBy === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sortBy === 'name') {
      sortOption = { name: 1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('createdBy', 'name email');

    res.json({
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get home page products
router.get('/home/featured', async (req, res) => {
  try {
    const products = await Product.find({ showOnHome: true }).limit(6).populate('createdBy', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Manager only)
router.post('/', authMiddleware, roleMiddleware(['manager', 'admin']), validateProductInput, async (req, res) => {
  try {
    const { name, description, category, price, availableQuantity, minimumOrderQuantity, images, demoVideoLink, paymentOptions, showOnHome } = req.body;

    const product = new Product({
      name,
      description,
      category,
      price,
      availableQuantity,
      minimumOrderQuantity,
      images,
      demoVideoLink,
      paymentOptions,
      showOnHome: showOnHome || false,
      createdBy: req.user.id
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', authMiddleware, roleMiddleware(['manager', 'admin']), validateProductInput, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', authMiddleware, roleMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
