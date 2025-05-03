const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

// Import controller methods
// Note: We'll create this controller later
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductReviews
} = require('../controllers/product.controller');

// Get all products and create a product
router.route('/')
  .get(getProducts)
  .post(
    protect,
    authorize('admin'),
    uploadProduct.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('categories', 'At least one category is required').not().isEmpty(),
      check('countInStock', 'Count in stock is required').isNumeric()
    ],
    createProduct
  );

// Get featured products
router.get('/featured', getFeaturedProducts);

// Get, update and delete single product
router.route('/:id')
  .get(getProduct)
  .put(
    protect,
    authorize('admin'),
    uploadProduct.single('image'),
    [
      check('name', 'Name is required').optional(),
      check('description', 'Description is required').optional(),
      check('price', 'Price must be a number').optional().isNumeric(),
      check('countInStock', 'Count in stock must be a number').optional().isNumeric()
    ],
    updateProduct
  )
  .delete(protect, authorize('admin'), deleteProduct);

// Get product reviews
router.get('/:id/reviews', getProductReviews);

module.exports = router; 