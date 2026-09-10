import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['preset', 'custom'],
    default: 'custom'
  },
  name: {
    type: String,
    required: true
  },
  base: {
    type: String,
    required: true
  },
  sauce: {
    type: String,
    required: true
  },
  cheese: {
    type: String,
    required: true
  },
  veggies: [
    {
      type: String
    }
  ],
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: null },
      deliveryAddress: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 3.5
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    payment: {
      gateway: {
        type: String,
        default: 'razorpay'
      },
      razorpayOrderId: {
        type: String,
        default: null
      },
      razorpayPaymentId: {
        type: String,
        default: null
      },
      razorpaySignature: {
        type: String,
        default: null
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
        index: true
      },
      paidAt: {
        type: Date,
        default: null
      }
    },
    orderStatus: {
      type: String,
      enum: ['received', 'in_kitchen', 'sent_to_delivery', 'delivered', 'cancelled'],
      default: 'received',
      index: true
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Compound index for fast queries by customer + creation date
orderSchema.index({ customer: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
