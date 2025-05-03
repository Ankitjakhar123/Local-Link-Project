const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide a product']
      },
      name: {
        type: String,
        required: [true, 'Please provide a name']
      },
      quantity: {
        type: Number,
        required: [true, 'Please provide a quantity'],
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: [true, 'Please provide a price']
      },
      image: {
        type: String,
        required: [true, 'Please provide an image']
      }
    }
  ],
  shippingAddress: {
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
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'netbanking', 'upi', 'wallet', 'cash_on_delivery'],
    required: [true, 'Please provide a payment method']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: [true, 'Please provide items price'],
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: [true, 'Please provide tax price'],
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: [true, 'Please provide shipping price'],
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price'],
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'processing'
  },
  trackingNumber: {
    type: String
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  notes: {
    type: String
  },
  couponCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update product stock and sales count
OrderSchema.post('save', async function() {
  // Only update if the order is being placed (not being updated)
  if (this.isNew) {
    const Product = this.model('Product');
    
    for (const item of this.orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 
          countInStock: -item.quantity,
          totalSales: item.quantity
        }
      });
    }
  }
});

module.exports = mongoose.model('Order', OrderSchema); 