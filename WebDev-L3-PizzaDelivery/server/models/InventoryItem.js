import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['base', 'sauce', 'cheese', 'veggie'],
      index: true
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 100,
      min: 0
    },
    alertThreshold: {
      type: Number,
      required: true,
      default: 20,
      min: 1
    },
    unitOfMeasure: {
      type: String,
      default: 'units'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    lastAlertSentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness per category
inventoryItemSchema.index({ name: 1, category: 1 }, { unique: true });

// Pre-save hook to ensure isAvailable reflects stock quantity
inventoryItemSchema.pre('save', function (next) {
  this.isAvailable = this.stockQuantity > 0;
  next();
});

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
