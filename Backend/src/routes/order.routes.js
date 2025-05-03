const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controller methods
// Note: We'll create this controller later
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getUserOrders,
  getMyOrders
} = require('../controllers/order.controller');

// Get all orders (admin) and create an order (any authenticated user)
router.route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(
    protect,
    [
      check('orderItems', 'Order items are required').isArray().notEmpty(),
      check('orderItems.*.productId', 'Product ID is required').not().isEmpty(),
      check('orderItems.*.quantity', 'Quantity must be a number greater than 0').isInt({ min: 1 }),
      check('shippingAddress', 'Shipping address is required').notEmpty(),
      check('paymentMethod', 'Payment method is required').not().isEmpty(),
      check('itemsPrice', 'Items price is required').isNumeric(),
      check('taxPrice', 'Tax price is required').isNumeric(),
      check('shippingPrice', 'Shipping price is required').isNumeric(),
      check('totalPrice', 'Total price is required').isNumeric()
    ],
    createOrder
  );

// Get current user's orders
router.get('/myorders', protect, getMyOrders);

// Get user's orders (admin only)
router.get('/user/:userId', protect, authorize('admin'), getUserOrders);

// Get, update and delete single order
router.route('/:id')
  .get(protect, getOrder)
  .put(protect, authorize('admin'), updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

// Update order status
router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [
    check('orderStatus', 'Order status is required').isIn([
      'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'
    ])
  ],
  updateOrderStatus
);

module.exports = router; 