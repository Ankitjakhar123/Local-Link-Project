const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

// Import controller methods
// Note: We'll define these methods later
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserAvatar,
  getUserProfile,
  getUserBookings,
  getUserOrders
} = require('../controllers/user.controller');

// Public route to get a user's public profile
router.get('/profile/:id', getUserProfile);

// Routes that require authentication
router.use(protect);

// Get current user's bookings and orders
router.get('/bookings', getUserBookings);
router.get('/orders', getUserOrders);

// Upload avatar
router.post(
  '/avatar',
  uploadAvatar.single('avatar'),
  uploadUserAvatar
);

// Admin-only routes
router.use(authorize('admin'));

// Get all users and create a user (admin only)
router.route('/')
  .get(getUsers)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
      check('role', 'Role is required').isIn(['customer', 'provider', 'admin'])
    ],
    createUser
  );

// Get, update and delete a user (admin only)
router.route('/:id')
  .get(getUser)
  .put(
    [
      check('name', 'Name is required').optional(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('role', 'Role must be customer, provider, or admin').optional().isIn(['customer', 'provider', 'admin']),
      check('status', 'Status must be active, inactive, or suspended').optional().isIn(['active', 'inactive', 'suspended'])
    ],
    updateUser
  )
  .delete(deleteUser);

module.exports = router; 