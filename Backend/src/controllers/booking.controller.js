const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = {};
    
    // Add query parameters to filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.service) {
      filter.serviceId = req.query.service;
    }
    
    if (req.query.provider) {
      filter.providerId = req.query.provider;
    }
    
    if (req.query.user) {
      filter.userId = req.query.user;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.bookingDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.bookingDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.bookingDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email avatar')
      .populate('serviceId', 'name image')
      .populate('providerId', 'name email avatar')
      .sort({ bookingDate: -1, bookingTime: -1 })
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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email avatar phone')
      .populate({
        path: 'serviceId',
        select: 'name description image basePrice',
        populate: { path: 'categories', select: 'name' }
      })
      .populate('providerId', 'name email avatar phone');
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check if user has permission to access this booking
    if (
      booking.userId._id.toString() !== req.user.id &&
      booking.providerId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this booking'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Get service details
    const service = await Service.findById(req.body.serviceId);
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }
    
    // Check if service is active
    if (service.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Service is not available for booking'
      });
    }
    
    // Create booking with current user as customer
    const bookingData = {
      ...req.body,
      userId: req.user.id,
      providerId: service.providerId
    };
    
    // Create booking
    const booking = await Booking.create(bookingData);
    
    // Populate related data
    await booking.populate('serviceId', 'name image');
    await booking.populate('providerId', 'name avatar');
    
    res.status(201).json({
      status: 'success',
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    // Find booking
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check if user is the booking owner or admin
    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this booking'
      });
    }
    
    // Prevent changes to completed or cancelled bookings
    if (
      ['completed', 'cancelled'].includes(booking.status) &&
      req.user.role !== 'admin'
    ) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot update a ${booking.status} booking`
      });
    }
    
    // Update booking
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('serviceId', 'name image')
      .populate('providerId', 'name avatar');
    
    res.status(200).json({
      status: 'success',
      data: booking,
      message: 'Booking updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    // Find booking
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check if user is the booking owner or admin
    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this booking'
      });
    }
    
    // Prevent deletion of confirmed or in_progress bookings
    if (
      ['confirmed', 'in_progress'].includes(booking.status) &&
      req.user.role !== 'admin'
    ) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete a ${booking.status} booking`
      });
    }
    
    // Delete booking
    await booking.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get provider's bookings
// @route   GET /api/bookings/provider
// @access  Private/Provider
exports.getProviderBookings = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = { providerId: req.user.id };
    
    // Add query parameters to filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.service) {
      filter.serviceId = req.query.service;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.bookingDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.bookingDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.bookingDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const bookings = await Booking.find(filter)
      .populate('userId', 'name avatar')
      .populate('serviceId', 'name image')
      .sort({ bookingDate: -1, bookingTime: -1 })
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

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = { userId: req.user.id };
    
    // Add query parameters to filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.service) {
      filter.serviceId = req.query.service;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.bookingDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.bookingDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.bookingDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const bookings = await Booking.find(filter)
      .populate('serviceId', 'name image')
      .populate('providerId', 'name avatar')
      .sort({ bookingDate: -1, bookingTime: -1 })
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

// @desc    Change booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.changeBookingStatus = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find booking
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }
    
    // Check permissions based on the requested status change
    const isProvider = booking.providerId.toString() === req.user.id;
    const isCustomer = booking.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    // Status change permissions
    if (req.body.status === 'cancelled') {
      // Both customer and provider can cancel
      if (!isCustomer && !isProvider && !isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to cancel this booking'
        });
      }
      
      // Save who cancelled the booking
      req.body.cancelledBy = isCustomer ? 'user' : (isProvider ? 'provider' : 'admin');
    } else if (['confirmed', 'in_progress', 'completed'].includes(req.body.status)) {
      // Only provider and admin can confirm, start or complete
      if (!isProvider && !isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: `Not authorized to mark booking as ${req.body.status}`
        });
      }
    } else if (req.body.status === 'rescheduled') {
      // Both customer and provider can reschedule
      if (!isCustomer && !isProvider && !isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to reschedule this booking'
        });
      }
    }
    
    // Update booking status
    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        cancellationReason: req.body.cancellationReason,
        cancelledBy: req.body.cancelledBy
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('serviceId', 'name image')
      .populate('providerId', 'name avatar')
      .populate('userId', 'name avatar');
    
    res.status(200).json({
      status: 'success',
      data: booking,
      message: `Booking status updated to ${req.body.status}`
    });
  } catch (err) {
    next(err);
  }
}; 