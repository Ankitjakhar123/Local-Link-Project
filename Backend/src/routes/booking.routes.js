const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controller
// Note: We'll create this controller later
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getProviderBookings,
  getUserBookings,
  changeBookingStatus
} = require('../controllers/booking.controller');

// Get all bookings (admin only)
router.route('/')
  .get(protect, authorize('admin'), getBookings)
  .post(
    protect,
    [
      check('serviceId', 'Service ID is required').not().isEmpty(),
      check('bookingDate', 'Booking date is required').isISO8601().toDate(),
      check('bookingTime', 'Booking time is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty(),
      check('contactPhone', 'Contact phone is required').not().isEmpty(),
      check('contactEmail', 'Valid contact email is required').isEmail(),
      check('totalAmount', 'Total amount is required').isNumeric()
    ],
    createBooking
  );

// Get provider's bookings
router.get('/provider', protect, authorize('provider', 'admin'), getProviderBookings);

// Get user's bookings
router.get('/user', protect, getUserBookings);

// Individual booking routes
router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

// Change booking status
router.put(
  '/:id/status',
  protect,
  [
    check('status', 'Status is required').isIn([
      'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'
    ])
  ],
  changeBookingStatus
);

module.exports = router; 