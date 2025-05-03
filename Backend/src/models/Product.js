const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be a positive number']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount must be a positive number'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select at least one category']
  }],
  image: {
    type: String,
    required: [true, 'Please provide an image for the product']
  },
  gallery: [String],
  brand: {
    type: String
  },
  countInStock: {
    type: Number,
    required: [true, 'Please provide stock count'],
    min: [0, 'Count in stock must be a positive number'],
    default: 0
  },
  features: [{
    type: String
  }],
  specifications: [
    {
      name: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  totalSales: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from the name
ProductSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

// Update stock status automatically
ProductSchema.pre('save', function(next) {
  if (this.countInStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.isActive) {
    this.status = 'active';
  } else {
    this.status = 'inactive';
  }
  next();
});

// Virtual reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  justOne: false
});

// Static method to get average rating and update
ProductSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.model('Review').aggregate([
    {
      $match: { productId: productId }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      rating: obj[0]?.averageRating || 0,
      numReviews: obj[0]?.numReviews || 0
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Product', ProductSchema); 