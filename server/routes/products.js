const express = require('express');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create product listing
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      condition,
      price,
      originalPrice,
      image,
      brand,
      model,
      age,
      specifications,
      location,
      isNegotiable,
      tags
    } = req.body;

    // Transform location string to object if needed
    let locationObj = {};
    if (typeof location === 'string') {
      const locationParts = location.split(', ');
      locationObj = {
        city: locationParts[0] || '',
        state: locationParts[1] || ''
      };
    } else if (location) {
      locationObj = location;
    }

    // Transform age to year
    const currentYear = new Date().getFullYear();
    const year = age ? currentYear - parseInt(age) : currentYear;

    // Handle images array
    const images = image ? [image] : [];

    const product = new Product({
      seller: req.user._id,
      name,
      description,
      category,
      condition,
      price,
      originalPrice,
      images,
      image,
      brand,
      model,
      year,
      specifications,
      location: locationObj,
      locationString: location,
      isNegotiable,
      tags
    });

    await product.save();

    res.status(201).json({
      message: 'Product listed successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      'Laptops',
      'Smartphones', 
      'Tablets',
      'Desktop Computers',
      'Monitors',
      'Keyboards',
      'Mice',
      'Headphones',
      'Speakers',
      'Other'
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const filter = { status: 'available' };
    
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('seller', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's products
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get sold products (for admin and sellers)
router.get('/sold', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let filter = { status: 'sold' };
    
    // If user is not admin, only show their own sold products
    if (req.user.role !== 'admin') {
      filter.seller = req.user._id;
    }

    const soldProducts = await Product.find(filter)
      .populate('seller', 'name email')
      .populate('buyer', 'name email')
      .sort({ soldAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      soldProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone location');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Buy product
router.post('/:id/buy', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is available
    if (product.status !== 'available') {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }

    // Check if user is not buying their own product
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot buy your own product' });
    }

    // Update product status to sold
    product.status = 'sold';
    product.buyer = req.user._id;
    product.soldAt = new Date();
    product.isAvailable = false;
    await product.save();

    res.json({
      message: 'Product purchased successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle product availability
router.patch('/:id/toggle-availability', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.json({
      message: `Product ${product.isAvailable ? 'made available' : 'made unavailable'}`,
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({ 
      category: req.params.category,
      isAvailable: true 
    })
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments({ 
      category: req.params.category,
      isAvailable: true 
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 