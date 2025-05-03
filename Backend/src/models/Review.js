const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  // Used for either service reviews or product reviews
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  // Reference to booking if it's a service review
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  // Reference to order if it's a product review
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  response: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// One user can only review a service/product once
ReviewSchema.index(
  { userId: 1, serviceId: 1 }, 
  { unique: true, partialFilterExpression: { serviceId: { $exists: true } } }
);

ReviewSchema.index(
  { userId: 1, productId: 1 }, 
  { unique: true, partialFilterExpression: { productId: { $exists: true } } }
);

// Validate that either serviceId or productId is provided, but not both
ReviewSchema.pre('validate', function(next) {
  if (!this.serviceId && !this.productId) {
    next(new Error('Either serviceId or productId must be provided'));
  }
  if (this.serviceId && this.productId) {
    next(new Error('Review cannot be for both service and product'));
  }
  next();
});

// Update service rating
ReviewSchema.post('save', async function() {
  if (this.serviceId) {
    try {
      await this.model('Service').getAverageRating(this.serviceId);
      
      // Mark the booking as reviewed
      if (this.bookingId) {
        await this.model('Booking').findByIdAndUpdate(this.bookingId, {
          isReviewed: true
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
});

// Update product rating
ReviewSchema.post('save', async function() {
  if (this.productId) {
    try {
      await this.model('Product').getAverageRating(this.productId);
    } catch (err) {
      console.error(err);
    }
  }
});

// Update ratings on review removal
ReviewSchema.post('remove', async function() {
  if (this.serviceId) {
    await this.model('Service').getAverageRating(this.serviceId);
  }
  if (this.productId) {
    await this.model('Product').getAverageRating(this.productId);
  }
});

module.exports = mongoose.model('Review', ReviewSchema); 