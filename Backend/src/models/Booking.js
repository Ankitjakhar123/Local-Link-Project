const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please provide a service']
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a service provider']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please provide a booking date']
  },
  bookingTime: {
    type: String,
    required: [true, 'Please provide a booking time']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide a street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide a contact phone number']
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide a contact email']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  duration: {
    type: Number,
    default: 1,
    min: [0.5, 'Duration must be at least 30 minutes (0.5 hours)']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide the total amount']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'netbanking', 'upi', 'wallet', 'cash'],
    default: 'cash'
  },
  paymentId: {
    type: String
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'provider', 'admin', null],
    default: null
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

// When a booking is created, update the service's totalBookings count
BookingSchema.post('save', async function() {
  try {
    const Service = this.model('Service');
    await Service.findByIdAndUpdate(this.serviceId, {
      $inc: { totalBookings: 1 }
    });
  } catch (err) {
    console.error('Error updating service total bookings:', err);
  }
});

// Virtual review
BookingSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookingId',
  justOne: true
});

module.exports = mongoose.model('Booking', BookingSchema); 