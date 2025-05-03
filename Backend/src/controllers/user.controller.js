const User = require('../models/User');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = {};
    
    // Add query parameters to filter
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.isVerified) {
      filter.isVerified = req.query.isVerified === 'true';
    }
    
    // Search by name or email
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await User.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: users.length,
      total,
      totalPages,
      currentPage: page,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Check if user with this email already exists
    const userExists = await User.findOne({ email: req.body.email });
    
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await User.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: user,
      message: 'User created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find user
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Prevent password update through this route
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      status: 'success',
      data: user,
      message: 'User updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Delete avatar from Cloudinary if it exists
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`locallink/avatars/${publicId}`);
    }
    
    // Delete user
    await user.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a file'
      });
    }
    
    // Get user
    const user = await User.findById(req.user.id);
    
    // Delete previous avatar from Cloudinary if it exists
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`locallink/avatars/${publicId}`);
    }
    
    // Update user with new avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      status: 'success',
      data: updatedUser,
      message: 'Avatar uploaded successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user public profile
// @route   GET /api/users/profile/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar role createdAt')
      .populate({
        path: 'services',
        select: 'name image rating',
        match: { status: 'active' }
      });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Get user's total ratings and reviews
    const reviewsCount = await user.model('Review').countDocuments({
      providerId: user._id
    });
    
    // Get average rating
    let averageRating = 0;
    if (reviewsCount > 0) {
      const ratingData = await user.model('Review').aggregate([
        { $match: { providerId: user._id } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ]);
      
      if (ratingData.length > 0) {
        averageRating = ratingData[0].avg;
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        ...user.toObject(),
        reviewsCount,
        averageRating
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/users/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filter by status if provided
    const filter = { userId: req.user.id };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Get bookings
    const bookings = await Booking.find(filter)
      .populate('serviceId', 'name image')
      .populate('providerId', 'name avatar')
      .sort({ bookingDate: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Booking.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: bookings.length,
      total,
      totalPages,
      currentPage: page,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's orders
// @route   GET /api/users/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filter by status if provided
    const filter = { userId: req.user.id };
    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }
    
    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Order.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: orders.length,
      total,
      totalPages,
      currentPage: page,
      data: orders
    });
  } catch (err) {
    next(err);
  }
}; 