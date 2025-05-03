const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = {};
    
    // Add query parameters to filter
    if (req.query.serviceId) {
      filter.serviceId = req.query.serviceId;
    }
    
    if (req.query.productId) {
      filter.productId = req.query.productId;
    }
    
    if (req.query.providerId) {
      filter.providerId = req.query.providerId;
    }
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }
    
    if (req.query.isApproved) {
      filter.isApproved = req.query.isApproved === 'true';
    }
    
    if (req.query.minRating && req.query.maxRating) {
      filter.rating = {
        $gte: parseInt(req.query.minRating),
        $lte: parseInt(req.query.maxRating)
      };
    } else if (req.query.minRating) {
      filter.rating = { $gte: parseInt(req.query.minRating) };
    } else if (req.query.maxRating) {
      filter.rating = { $lte: parseInt(req.query.maxRating) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'rating-high':
          sortOption = { rating: -1 };
          break;
        case 'rating-low':
          sortOption = { rating: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      // Default sort by createdAt (newest first)
      sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const reviews = await Review.find(filter)
      .populate('userId', 'name avatar')
      .populate('serviceId', 'name image')
      .populate('productId', 'name image')
      .populate('providerId', 'name avatar')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Review.countDocuments(filter);
    
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

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name avatar')
      .populate('serviceId', 'name image')
      .populate('productId', 'name image')
      .populate('providerId', 'name avatar')
      .populate('response.respondedBy', 'name avatar');
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Validate that either serviceId or productId is provided
    if (!req.body.serviceId && !req.body.productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Either serviceId or productId must be provided'
      });
    }
    
    if (req.body.serviceId && req.body.productId) {
      return res.status(400).json({
        status: 'error',
        message: 'Review cannot be for both service and product'
      });
    }
    
    // Check if user has already reviewed this item
    const existingReview = await Review.findOne({
      userId: req.user.id,
      ...(req.body.serviceId ? { serviceId: req.body.serviceId } : { productId: req.body.productId })
    });
    
    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this item'
      });
    }
    
    // Create review data
    const reviewData = {
      ...req.body,
      userId: req.user.id,
      isVerifiedPurchase: false
    };
    
    // If it's a service review, validate booking and get provider ID
    if (req.body.serviceId) {
      // Check if service exists
      const service = await Service.findById(req.body.serviceId);
      if (!service) {
        return res.status(404).json({
          status: 'error',
          message: 'Service not found'
        });
      }
      
      // Set provider ID
      reviewData.providerId = service.providerId;
      
      // If booking ID is provided, verify it
      if (req.body.bookingId) {
        const booking = await Booking.findById(req.body.bookingId);
        
        if (!booking) {
          return res.status(404).json({
            status: 'error',
            message: 'Booking not found'
          });
        }
        
        // Verify booking belongs to this user and service
        if (
          booking.userId.toString() !== req.user.id ||
          booking.serviceId.toString() !== req.body.serviceId
        ) {
          return res.status(403).json({
            status: 'error',
            message: 'This booking does not belong to you or is not for this service'
          });
        }
        
        // Verify booking is completed
        if (booking.status !== 'completed') {
          return res.status(400).json({
            status: 'error',
            message: 'You can only review completed bookings'
          });
        }
        
        // Verify booking is not already reviewed
        if (booking.isReviewed) {
          return res.status(400).json({
            status: 'error',
            message: 'This booking has already been reviewed'
          });
        }
        
        // Mark as verified purchase
        reviewData.isVerifiedPurchase = true;
      }
    }
    
    // If it's a product review, validate order and get order ID
    if (req.body.productId) {
      // Check if product exists
      const product = await Product.findById(req.body.productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }
      
      // If order ID is provided, verify it
      if (req.body.orderId) {
        const order = await Order.findById(req.body.orderId);
        
        if (!order) {
          return res.status(404).json({
            status: 'error',
            message: 'Order not found'
          });
        }
        
        // Verify order belongs to this user
        if (order.userId.toString() !== req.user.id) {
          return res.status(403).json({
            status: 'error',
            message: 'This order does not belong to you'
          });
        }
        
        // Verify order is delivered
        if (!order.isDelivered || order.orderStatus !== 'delivered') {
          return res.status(400).json({
            status: 'error',
            message: 'You can only review delivered orders'
          });
        }
        
        // Verify order contains this product
        const orderContainsProduct = order.orderItems.some(
          item => item.productId.toString() === req.body.productId
        );
        
        if (!orderContainsProduct) {
          return res.status(400).json({
            status: 'error',
            message: 'This order does not contain the product you are trying to review'
          });
        }
        
        // Mark as verified purchase
        reviewData.isVerifiedPurchase = true;
      }
    }
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      reviewData.images = req.files.map(file => file.path);
    }
    
    // Create review
    const review = await Review.create(reviewData);
    
    // If review is for a service booking, mark booking as reviewed
    if (req.body.serviceId && req.body.bookingId) {
      await Booking.findByIdAndUpdate(req.body.bookingId, {
        isReviewed: true
      });
    }
    
    // Populate review data for response
    await review.populate('userId', 'name avatar');
    if (review.serviceId) {
      await review.populate('serviceId', 'name image');
    }
    if (review.productId) {
      await review.populate('productId', 'name image');
    }
    
    res.status(201).json({
      status: 'success',
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find review
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    
    // Check if user is the review owner
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this review'
      });
    }
    
    // Update review with new data
    const updateData = {
      ...(req.body.rating && { rating: req.body.rating }),
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.comment && { comment: req.body.comment })
    };
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Delete previous images from Cloudinary if they exist
      if (review.images && review.images.length > 0) {
        for (const imageUrl of review.images) {
          if (imageUrl.includes('cloudinary')) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`locallink/reviews/${publicId}`);
          }
        }
      }
      
      // Update with new images
      updateData.images = req.files.map(file => file.path);
    }
    
    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('userId', 'name avatar')
      .populate('serviceId', 'name image')
      .populate('productId', 'name image');
    
    res.status(200).json({
      status: 'success',
      data: review,
      message: 'Review updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    // Find review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    
    // Check if user is the review owner or admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }
    
    // Delete images from Cloudinary if they exist
    if (review.images && review.images.length > 0) {
      for (const imageUrl of review.images) {
        if (imageUrl.includes('cloudinary')) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`locallink/reviews/${publicId}`);
        }
      }
    }
    
    // Delete review
    await review.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a review
// @route   PUT /api/reviews/:id/like
// @access  Private
exports.likeReview = async (req, res, next) => {
  try {
    // Find review
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    
    // Check if user has already liked this review
    const alreadyLiked = review.likes.includes(req.user.id);
    
    // Toggle like
    if (alreadyLiked) {
      // Remove like
      review = await Review.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user.id } },
        {
          new: true,
          runValidators: true
        }
      )
        .populate('userId', 'name avatar')
        .populate('serviceId', 'name image')
        .populate('productId', 'name image');
      
      res.status(200).json({
        status: 'success',
        data: review,
        message: 'Review unliked successfully'
      });
    } else {
      // Add like
      review = await Review.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: req.user.id } },
        {
          new: true,
          runValidators: true
        }
      )
        .populate('userId', 'name avatar')
        .populate('serviceId', 'name image')
        .populate('productId', 'name image');
      
      res.status(200).json({
        status: 'success',
        data: review,
        message: 'Review liked successfully'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Respond to a review
// @route   POST /api/reviews/:id/respond
// @access  Private (Provider or Admin)
exports.respondToReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find review
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    
    // Check if user is the service provider or admin
    const isProvider = review.providerId && 
      review.providerId.toString() === req.user.id;
    
    if (!isProvider && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to respond to this review'
      });
    }
    
    // Create response
    const response = {
      text: req.body.text,
      respondedAt: Date.now(),
      respondedBy: req.user.id
    };
    
    // Update review with response
    review = await Review.findByIdAndUpdate(
      req.params.id,
      { response },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('userId', 'name avatar')
      .populate('serviceId', 'name image')
      .populate('productId', 'name image')
      .populate('response.respondedBy', 'name avatar');
    
    res.status(200).json({
      status: 'success',
      data: review,
      message: 'Response added successfully'
    });
  } catch (err) {
    next(err);
  }
}; 