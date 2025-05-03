const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize, isResourceOwner } = require('../middleware/auth');
const Review = require('../models/Review');
const { uploadService } = require('../config/cloudinary');

// Import controller methods
// Note: We'll create this controller later
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  respondToReview
} = require('../controllers/review.controller');

// Get all reviews and create a review
router.route('/')
  .get(getReviews)
  .post(
    protect,
    uploadService.array('images', 3), // Allow up to 3 images per review
    [
      check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
      check('comment', 'Comment is required').not().isEmpty(),
      check('serviceId', 'Service ID is required if reviewing a service').optional(),
      check('productId', 'Product ID is required if reviewing a product').optional(),
      check('bookingId', 'Booking ID is required if reviewing a service').optional(),
      check('orderId', 'Order ID is required if reviewing a product').optional()
    ],
    createReview
  );

// Get, update and delete single review
router.route('/:id')
  .get(getReview)
  .put(
    protect,
    isResourceOwner(Review, 'id', 'userId'),
    uploadService.array('images', 3),
    [
      check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
      check('comment', 'Comment is required').optional().not().isEmpty()
    ],
    updateReview
  )
  .delete(
    protect,
    isResourceOwner(Review, 'id', 'userId'),
    deleteReview
  );

// Like a review
router.put('/:id/like', protect, likeReview);

// Respond to a review (provider or admin only)
router.post(
  '/:id/respond',
  protect,
  authorize('provider', 'admin'),
  [
    check('text', 'Response text is required').not().isEmpty()
  ],
  respondToReview
);

module.exports = router; 