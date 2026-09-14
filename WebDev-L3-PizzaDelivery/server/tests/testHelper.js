import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Pizza } from '../models/Pizza.js';

let mongod = null;

export const setupTestDB = async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_oasis_sip_2026';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_mockKeyId';
  process.env.RAZORPAY_KEY_SECRET = 'mockSecretForHMACVerification2026';

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
  console.log(`[Test DB] Connected to In-Memory MongoDB: ${uri}`);
};

export const seedTestDB = async () => {
  await clearTestDB();

  // 1. Seed default customer and admin
  const customerPasswordHash = await User.hashPassword('Customer123!');
  const adminPasswordHash = await User.hashPassword('AdminSecret2026!');

  const customer = await User.create({
    name: 'Natnael Tezazu',
    email: 'customer@crustcraft.com',
    passwordHash: customerPasswordHash,
    role: 'customer',
    isVerified: true
  });

  const admin = await User.create({
    name: 'Oasis Admin',
    email: 'admin@crustcraft.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
    isVerified: true
  });

  // 2. Seed 5 bases, 5 sauces, cheeses, and veggies
  const ingredients = [
    // 5 BASES
    { name: 'Classic Hand-Tossed', category: 'base', unitPrice: 4.0, stockQuantity: 60, alertThreshold: 20 },
    { name: 'Thin Crust Crispy', category: 'base', unitPrice: 4.5, stockQuantity: 45, alertThreshold: 20 },
    { name: 'Rustic Sourdough', category: 'base', unitPrice: 5.0, stockQuantity: 35, alertThreshold: 20 },
    { name: 'Gluten-Free Cauliflower Crust', category: 'base', unitPrice: 5.5, stockQuantity: 25, alertThreshold: 20 },
    { name: 'Cheesy Garlic Stuffed Crust', category: 'base', unitPrice: 6.0, stockQuantity: 30, alertThreshold: 20 },

    // 5 SAUCES
    { name: 'San Marzano Marinara', category: 'sauce', unitPrice: 1.5, stockQuantity: 100, alertThreshold: 20 },
    { name: 'Fiery Arrabiata', category: 'sauce', unitPrice: 1.8, stockQuantity: 80, alertThreshold: 20 },
    { name: 'Creamy Roasted Garlic Alfredo', category: 'sauce', unitPrice: 2.2, stockQuantity: 50, alertThreshold: 20 },
    { name: 'Smoky Hickory BBQ', category: 'sauce', unitPrice: 2.0, stockQuantity: 70, alertThreshold: 20 },
    { name: 'Ligurian Basil Pesto', category: 'sauce', unitPrice: 2.5, stockQuantity: 60, alertThreshold: 20 },

    // CHEESES
    { name: 'Fior di Latte Mozzarella', category: 'cheese', unitPrice: 2.5, stockQuantity: 90, alertThreshold: 20 },
    { name: 'Aged Farmhouse Cheddar', category: 'cheese', unitPrice: 2.8, stockQuantity: 40, alertThreshold: 20 },
    { name: 'Smoked Gouda', category: 'cheese', unitPrice: 3.0, stockQuantity: 35, alertThreshold: 20 },
    { name: 'Fresh Sheep Ricotta', category: 'cheese', unitPrice: 3.2, stockQuantity: 25, alertThreshold: 20 },
    { name: 'Artisanal Cashew Vegan Cheese', category: 'cheese', unitPrice: 3.5, stockQuantity: 30, alertThreshold: 20 },

    // VEGGIES
    { name: 'Sweet Bell Peppers', category: 'veggie', unitPrice: 1.0, stockQuantity: 80, alertThreshold: 20 },
    { name: 'Slow-Caramelized Onions', category: 'veggie', unitPrice: 1.2, stockQuantity: 70, alertThreshold: 20 },
    { name: 'Kalamata Black Olives', category: 'veggie', unitPrice: 1.5, stockQuantity: 65, alertThreshold: 20 },
    { name: 'Pickled Jalapeños', category: 'veggie', unitPrice: 1.0, stockQuantity: 55, alertThreshold: 20 },
    { name: 'Button Mushrooms', category: 'veggie', unitPrice: 1.5, stockQuantity: 60, alertThreshold: 20 },
    { name: 'Sun-Dried Tomatoes', category: 'veggie', unitPrice: 1.8, stockQuantity: 45, alertThreshold: 20 }
  ];

  await InventoryItem.insertMany(ingredients);

  // 3. Seed signature pizzas
  const pizzas = [
    {
      name: 'Margherita Royale',
      slug: 'margherita-royale',
      description: 'DOP San Marzano crushed tomatoes, fresh Fior di Latte, hand-torn sweet basil, cold-pressed Sicilian EVOO.',
      basePrice: 18.5,
      defaultBase: 'Classic Hand-Tossed',
      defaultSauce: 'San Marzano Marinara',
      defaultCheese: 'Fior di Latte Mozzarella',
      defaultVeggies: ['Sun-Dried Tomatoes'],
      imageUrl: '/assets/posters/card-margherita.jpg'
    },
    {
      name: 'Truffle & Wild Funghi',
      slug: 'truffle-wild-funghi',
      description: 'Roasted cremini & oyster mushrooms, aged smoked gouda, velvety garlic alfredo, white Alba truffle glaze.',
      basePrice: 22.5,
      defaultBase: 'Rustic Sourdough',
      defaultSauce: 'Creamy Roasted Garlic Alfredo',
      defaultCheese: 'Smoked Gouda',
      defaultVeggies: ['Button Mushrooms', 'Slow-Caramelized Onions'],
      imageUrl: '/assets/posters/card-truffle.jpg'
    },
    {
      name: 'Diavola Piccante',
      slug: 'diavola-piccante',
      description: 'Fiery arrabiata reduction, aged cheddar, fire-charred peppers, pickled jalapeño wheels.',
      basePrice: 20.0,
      defaultBase: 'Thin Crust Crispy',
      defaultSauce: 'Fiery Arrabiata',
      defaultCheese: 'Aged Farmhouse Cheddar',
      defaultVeggies: ['Sweet Bell Peppers', 'Pickled Jalapeños'],
      imageUrl: '/assets/posters/card-diavola.jpg'
    },
    {
      name: 'Verde Pesto Harvest',
      slug: 'verde-pesto-harvest',
      description: 'Genovese basil pesto, sweet ricotta dollops, Kalamata black olives, caramelized onions.',
      basePrice: 21.0,
      defaultBase: 'Rustic Sourdough',
      defaultSauce: 'Ligurian Basil Pesto',
      defaultCheese: 'Fresh Sheep Ricotta',
      defaultVeggies: ['Kalamata Black Olives', 'Slow-Caramelized Onions'],
      imageUrl: '/assets/posters/card-verde.jpg'
    }
  ];

  await Pizza.insertMany(pizzas);

  return { customer, admin };
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};
