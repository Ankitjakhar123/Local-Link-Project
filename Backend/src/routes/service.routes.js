const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getFeaturedServices,
  getServiceReviews,
  getServicesByProvider
} = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadService } = require('../config/cloudinary');

// Get all services and create a service
router.route('/')
  .get(getServices)
  .post(
    protect,
    authorize('admin', 'provider'),
    uploadService.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('basePrice', 'Base price is required').isNumeric(),
      check('categories', 'At least one category is required').not().isEmpty()
    ],
    createService
  );

// Get featured services
router.get('/featured', getFeaturedServices);

// Get services by provider
router.get('/provider/:providerId', getServicesByProvider);

// Get, update and delete single service
router.route('/:id')
  .get(getService)
  .put(
    protect,
    uploadService.single('image'),
    [
      check('name', 'Name is required').optional(),
      check('description', 'Description is required').optional(),
      check('basePrice', 'Base price must be a number').optional().isNumeric()
    ],
    updateService
  )
  .delete(protect, deleteService);

// Get service reviews
router.get('/:id/reviews', getServiceReviews);

module.exports = router; 