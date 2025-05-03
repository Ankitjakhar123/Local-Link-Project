const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary storage for different types of uploads
const storage = {
  // Storage for service images
  services: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'locallink/services',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    }
  }),
  
  // Storage for product images
  products: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'locallink/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    }
  }),
  
  // Storage for user avatars
  avatars: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'locallink/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' }
      ]
    }
  })
};

// Create multer upload objects for different types
const uploadService = multer({ storage: storage.services });
const uploadProduct = multer({ storage: storage.products });
const uploadAvatar = multer({ storage: storage.avatars });

module.exports = {
  cloudinary,
  uploadService,
  uploadProduct,
  uploadAvatar
}; 