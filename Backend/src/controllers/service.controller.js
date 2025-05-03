const Service = require('../models/Service');
const User = require('../models/User');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const { cloudinary, uploadService } = require('../config/cloudinary');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
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
      // By default, show only active services
      filter.status = 'active';
    }
    
    if (req.query.provider) {
      filter.providerId = req.query.provider;
    }
    
    if (req.query.isPopular) {
      filter.isPopular = req.query.isPopular === 'true';
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.basePrice = {
        $gte: parseInt(req.query.minPrice),
        $lte: parseInt(req.query.maxPrice)
      };
    } else if (req.query.minPrice) {
      filter.basePrice = { $gte: parseInt(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      filter.basePrice = { $lte: parseInt(req.query.maxPrice) };
    }
    
    // Search by name or description
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
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
          sortOption = { basePrice: 1 };
          break;
        case 'price-desc':
          sortOption = { basePrice: -1 };
          break;
        case 'rating-desc':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'popular':
          sortOption = { totalBookings: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      // Default sort by createdAt
      sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const services = await Service.find(filter)
      .populate('categories', 'name slug')
      .populate('providerId', 'name avatar rating')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Service.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: services.length,
      total,
      totalPages,
      currentPage: page,
      data: services
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    // Find service by ID or slug
    const service = await Service.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    })
      .populate('categories', 'name slug')
      .populate('providerId', 'name avatar phone email rating')
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 }, limit: 5 },
        populate: {
          path: 'userId',
          select: 'name avatar'
        }
      });
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (providers and admins)
exports.createService = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // If user is not an admin and not a provider, reject
    if (req.user.role !== 'admin' && req.user.role !== 'provider') {
      return res.status(403).json({
        status: 'error',
        message: 'Only service providers can create services'
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
    
    // Create service with provider ID
    const serviceData = {
      ...req.body,
      providerId: req.user.id
    };
    
    // Handle image upload
    if (req.file) {
      serviceData.image = req.file.path;
    }
    
    // Create service
    const service = await Service.create(serviceData);
    
    res.status(201).json({
      status: 'success',
      data: service,
      message: 'Service created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (service owner or admin)
exports.updateService = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find service
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Check if user is service owner or admin
    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this service'
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
      if (service.image && service.image.includes('cloudinary')) {
        const publicId = service.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`locallink/services/${publicId}`);
      }
      
      // Update with new image
      req.body.image = req.file.path;
    }
    
    // Update service
    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: service,
      message: 'Service updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (service owner or admin)
exports.deleteService = async (req, res, next) => {
  try {
    // Find service
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Check if user is service owner or admin
    if (
      service.providerId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this service'
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (service.image && service.image.includes('cloudinary')) {
      const publicId = service.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`locallink/services/${publicId}`);
    }
    
    // Delete service
    await service.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'Service deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
exports.getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ 
      isPopular: true,
      status: 'active'
    })
      .populate('categories', 'name slug')
      .populate('providerId', 'name avatar rating')
      .sort({ rating: -1 })
      .limit(6);
    
    res.status(200).json({
      status: 'success',
      count: services.length,
      data: services
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get service reviews
// @route   GET /api/services/:id/reviews
// @access  Public
exports.getServiceReviews = async (req, res, next) => {
  try {
    // Find service
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get reviews
    const reviews = await service.model('Review').find({
      serviceId: service._id
    })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await service.model('Review').countDocuments({
      serviceId: service._id
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

// @desc    Get services by provider
// @route   GET /api/services/provider/:providerId
// @access  Public
exports.getServicesByProvider = async (req, res, next) => {
  try {
    // Find provider
    const provider = await User.findById(req.params.providerId);
    
    if (!provider) {
      return res.status(404).json({
        status: 'error',
        message: 'Provider not found'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get services
    const services = await Service.find({
      providerId: provider._id,
      status: 'active'
    })
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Service.countDocuments({
      providerId: provider._id,
      status: 'active'
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      count: services.length,
      total,
      totalPages,
      currentPage: page,
      provider: {
        _id: provider._id,
        name: provider.name,
        avatar: provider.avatar
      },
      data: services
    });
  } catch (err) {
    next(err);
  }
}; 