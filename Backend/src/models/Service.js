const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a service name'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
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
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select at least one category']
  }],
  basePrice: {
    type: Number,
    required: [true, 'Please provide a base price'],
    min: [0, 'Price must be a positive number']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount must be a positive number'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  pricingUnit: {
    type: String,
    default: 'per hour'
  },
  image: {
    type: String,
    required: [true, 'Please provide an image for the service']
  },
  gallery: [String],
  inclusions: [{
    text: {
      type: String,
      required: true
    }
  }],
  exclusions: [{
    text: {
      type: String,
      required: true
    }
  }],
  estimatedHours: {
    type: Number,
    min: 0
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a service provider']
  },
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
  availability: {
    type: String,
    enum: ['all_week', 'weekdays', 'weekends', 'custom'],
    default: 'all_week'
  },
  availabilityHours: {
    monday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    tuesday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    wednesday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    thursday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    friday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    saturday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    },
    sunday: {
      start: String,
      end: String,
      isAvailable: { type: Boolean, default: true }
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_approval'],
    default: 'active'
  },
  totalBookings: {
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
ServiceSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  next();
});

// Virtual reviews
ServiceSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'serviceId',
  justOne: false
});

// Virtual bookings
ServiceSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'serviceId',
  justOne: false
});

// Static method to get average rating and update
ServiceSchema.statics.getAverageRating = async function(serviceId) {
  const obj = await this.model('Review').aggregate([
    {
      $match: { serviceId: serviceId }
    },
    {
      $group: {
        _id: '$serviceId',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Service').findByIdAndUpdate(serviceId, {
      rating: obj[0]?.averageRating || 0,
      numReviews: obj[0]?.numReviews || 0
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Service', ServiceSchema); 