const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = {};
    
    // Add query parameters to filter
    if (req.query.category) {
      const category = await Category.findOne({ 
        $or: [
          { _id: req.query.category },
          { slug: req.query.category }
        ]
      });
      
      if (category) {
        filter.categories = category._id;
      }
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // By default, show only active and in-stock products
      filter.status = { $in: ['active'] };
    }
    
    if (req.query.isPopular) {
      filter.isPopular = req.query.isPopular === 'true';
    }
    
    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice)
      };
    } else if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      filter.price = { $lte: parseFloat(req.query.maxPrice) };
    }
    
    // Search by name, description, or brand
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'rating-desc':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'popular':
          sortOption = { totalSales: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      // Default sort by createdAt
      sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('categories', 'name slug')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Product.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: products.length,
      total,
      totalPages,
      currentPage: page,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    // Find product by ID or slug
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    })
      .populate('categories', 'name slug')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: 'userId',
          select: 'name avatar'
        }
      });
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Check if categories exist
    if (req.body.categories) {
      const categoryIds = Array.isArray(req.body.categories) 
        ? req.body.categories 
        : [req.body.categories];
      
      const categoriesCount = await Category.countDocuments({
        _id: { $in: categoryIds }
      });
      
      if (categoriesCount !== categoryIds.length) {
        return res.status(400).json({
          status: 'error',
          message: 'One or more categories are invalid'
        });
      }
    }
    
    // Create product data
    const productData = {
      ...req.body
    };
    
    // Handle image upload
    if (req.file) {
      productData.image = req.file.path;
    }
    
    // Create product
    const product = await Product.create(productData);
    
    res.status(201).json({
      status: 'success',
      data: product,
      message: 'Product created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find product
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Check if categories exist
    if (req.body.categories) {
      const categoryIds = Array.isArray(req.body.categories) 
        ? req.body.categories 
        : [req.body.categories];
      
      const categoriesCount = await Category.countDocuments({
        _id: { $in: categoryIds }
      });
      
      if (categoriesCount !== categoryIds.length) {
        return res.status(400).json({
          status: 'error',
          message: 'One or more categories are invalid'
        });
      }
    }
    
    // Handle image upload
    if (req.file) {
      // Delete previous image from Cloudinary if it exists
      if (product.image && product.image.includes('cloudinary')) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`locallink/products/${publicId}`);
      }
      
      // Update with new image
      req.body.image = req.file.path;
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('categories', 'name slug');
    
    res.status(200).json({
      status: 'success',
      data: product,
      message: 'Product updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    // Find product
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (product.image && product.image.includes('cloudinary')) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`locallink/products/${publicId}`);
    }
    
    // Delete product
    await product.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isFeatured: true,
      status: 'active'
    })
      .populate('categories', 'name slug')
      .sort({ rating: -1 })
      .limit(8);
    
    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    // Find product
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get reviews
    const reviews = await product.model('Review').find({
      productId: product._id
    })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await product.model('Review').countDocuments({
      productId: product._id
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: reviews.length,
      total,
      totalPages,
      currentPage: page,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
}; 