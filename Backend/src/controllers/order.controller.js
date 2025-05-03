const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    // Prepare filter conditions
    let filter = {};
    
    // Add query parameters to filter
    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }
    
    if (req.query.isPaid) {
      filter.isPaid = req.query.isPaid === 'true';
    }
    
    if (req.query.isDelivered) {
      filter.isDelivered = req.query.isDelivered === 'true';
    }
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    
    // Date range filter for createdAt
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const orders = await Order.find(filter)
      .populate('userId', 'name email avatar')
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email avatar phone')
      .populate('orderItems.productId', 'name image price');
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Check if user has permission to access this order
    if (
      order.userId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Verify products and calculate prices
    const orderItems = req.body.orderItems;
    
    // Map of product IDs to ensure we fetch each product only once
    const productIds = [...new Set(orderItems.map(item => item.productId))];
    
    // Fetch all products at once
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Create a map for faster lookup
    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});
    
    // Check if all products exist and are in stock
    for (const item of orderItems) {
      const product = productMap[item.productId];
      
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: `Product with ID ${item.productId} not found`
        });
      }
      
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} available.`
        });
      }
      
      // Add product details to the order item
      item.name = product.name;
      item.price = product.price;
      item.image = product.image;
    }
    
    // Create order with current user
    const orderData = {
      ...req.body,
      userId: req.user.id
    };
    
    // Create order
    const order = await Order.create(orderData);
    
    // Send response
    res.status(201).json({
      status: 'success',
      data: order,
      message: 'Order created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    // Find order
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Update order
    order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'name');
    
    res.status(200).json({
      status: 'success',
      data: order,
      message: 'Order updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    // Find order
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Delete order
    await order.remove();
    
    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find order
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Update status
    const updates = { orderStatus: req.body.orderStatus };
    
    // If status is delivered, mark as delivered
    if (req.body.orderStatus === 'delivered') {
      updates.isDelivered = true;
      updates.deliveredAt = Date.now();
    }
    
    // If status is paid (from payment webhook), mark as paid
    if (req.body.isPaid) {
      updates.isPaid = true;
      updates.paidAt = Date.now();
    }
    
    // Update order
    order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'name');
    
    res.status(200).json({
      status: 'success',
      data: order,
      message: `Order status updated to ${req.body.orderStatus}`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filter
    const filter = { userId: req.user.id };
    
    // Add status filter if provided
    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }
    
    // Get orders
    const orders = await Order.find(filter)
      .populate('orderItems.productId', 'name image')
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

// @desc    Get user orders (admin only)
// @route   GET /api/orders/user/:userId
// @access  Private/Admin
exports.getUserOrders = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filter
    const filter = { userId: req.params.userId };
    
    // Add status filter if provided
    if (req.query.orderStatus) {
      filter.orderStatus = req.query.orderStatus;
    }
    
    // Get orders
    const orders = await Order.find(filter)
      .populate('orderItems.productId', 'name image')
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