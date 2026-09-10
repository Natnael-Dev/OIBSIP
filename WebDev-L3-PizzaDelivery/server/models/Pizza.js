import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    defaultBase: {
      type: String,
      required: true
    },
    defaultSauce: {
      type: String,
      required: true
    },
    defaultCheese: {
      type: String,
      required: true
    },
    defaultVeggies: [
      {
        type: String
      }
    ],
    imageUrl: {
      type: String,
      required: true
    },
    tags: [
      {
        type: String
      }
    ],
    isPopular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Pizza = mongoose.model('Pizza', pizzaSchema);
