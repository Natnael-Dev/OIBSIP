import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Pizza } from '../models/Pizza.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crust_and_craft';

const seedDatabase = async () => {
  try {
    console.log(`[Seed Engine] Connecting to ${uri}...`);
    await mongoose.connect(uri);
    console.log('[Seed Engine] MongoDB Connected.');

    // 1. Purge existing collections
    await Promise.all([
      User.deleteMany({}),
      InventoryItem.deleteMany({}),
      Pizza.deleteMany({})
    ]);
    console.log('[Seed Engine] Cleared existing records.');

    // 2. Seed Default Accounts
    const adminPasswordHash = await User.hashPassword('AdminSecret2026!');
    const customerPasswordHash = await User.hashPassword('CustomerPass2026!');

    const admin = await User.create({
      name: 'Oasis Store Director',
      email: 'admin@crustcraft.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true
    });

    const customer = await User.create({
      name: 'Natnael Tezazu',
      email: 'natnael@crustcraft.com',
      passwordHash: customerPasswordHash,
      phone: '+251911223344',
      role: 'customer',
      isVerified: true
    });
    console.log('[Seed Engine] Default Admin and Customer seeded.');

    // 3. Seed Ingredients (Strictly fulfilling Oasis Infobyte Task Card)
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
      { name: 'Ligurian Basil Pesto', category: 'sauce', unitPrice: 2.5, stockQuantity: 40, alertThreshold: 20 },

      // CHEESES
      { name: 'Fior di Latte Mozzarella', category: 'cheese', unitPrice: 2.5, stockQuantity: 120, alertThreshold: 20 },
      { name: 'Sharp Aged Cheddar', category: 'cheese', unitPrice: 2.8, stockQuantity: 60, alertThreshold: 20 },
      { name: 'Smoked Gouda', category: 'cheese', unitPrice: 3.0, stockQuantity: 45, alertThreshold: 20 },
      { name: 'Fresh Ricotta Dollops', category: 'cheese', unitPrice: 3.2, stockQuantity: 30, alertThreshold: 20 },
      { name: 'Artisanal Vegan Cashew Cheese', category: 'cheese', unitPrice: 3.5, stockQuantity: 25, alertThreshold: 20 },

      // VEGETABLES
      { name: 'Sweet Bell Peppers', category: 'veggie', unitPrice: 1.0, stockQuantity: 150, alertThreshold: 20 },
      { name: 'Slow-Caramelized Onions', category: 'veggie', unitPrice: 1.2, stockQuantity: 90, alertThreshold: 20 },
      { name: 'Kalamata Black Olives', category: 'veggie', unitPrice: 1.5, stockQuantity: 80, alertThreshold: 20 },
      { name: 'Pickled Jalapeños', category: 'veggie', unitPrice: 1.0, stockQuantity: 110, alertThreshold: 20 },
      { name: 'Button Mushrooms', category: 'veggie', unitPrice: 1.5, stockQuantity: 75, alertThreshold: 20 },
      { name: 'Sun-Dried Tomatoes', category: 'veggie', unitPrice: 1.8, stockQuantity: 60, alertThreshold: 20 }
    ];

    await InventoryItem.insertMany(ingredients);
    console.log(`[Seed Engine] Seeded ${ingredients.length} inventory items across all 4 categories.`);

    // 4. Seed Signature Preset Pizzas
    const signaturePizzas = [
      {
        name: 'Margherita Royale',
        slug: 'margherita-royale',
        description: 'Authentic San Marzano marinara, torn Fior di Latte mozzarella, extra virgin olive oil, and fresh basil leaves on hand-tossed crust.',
        basePrice: 14.5,
        defaultBase: 'Classic Hand-Tossed',
        defaultSauce: 'San Marzano Marinara',
        defaultCheese: 'Fior di Latte Mozzarella',
        defaultVeggies: ['Sweet Bell Peppers'],
        imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
        tags: ['Vegetarian', 'Classic', 'Bestseller'],
        isPopular: true
      },
      {
        name: 'Truffle & Wild Funghi',
        slug: 'truffle-wild-funghi',
        description: 'Creamy roasted garlic Alfredo, smoked gouda, button mushrooms, caramelized onions, and white truffle oil drizzle on rustic sourdough.',
        basePrice: 18.0,
        defaultBase: 'Rustic Sourdough',
        defaultSauce: 'Creamy Roasted Garlic Alfredo',
        defaultCheese: 'Smoked Gouda',
        defaultVeggies: ['Button Mushrooms', 'Slow-Caramelized Onions'],
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
        tags: ['Gourmet', 'Chef Special'],
        isPopular: true
      },
      {
        name: 'Diavola Piccante',
        slug: 'diavola-piccante',
        description: 'Fiery Arrabiata base, sharp aged cheddar, pickled jalapeños, sweet peppers, and spicy chili threads on a crispy thin crust.',
        basePrice: 16.5,
        defaultBase: 'Thin Crust Crispy',
        defaultSauce: 'Fiery Arrabiata',
        defaultCheese: 'Sharp Aged Cheddar',
        defaultVeggies: ['Pickled Jalapeños', 'Sweet Bell Peppers'],
        imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
        tags: ['Spicy', 'Crispy Crust'],
        isPopular: false
      },
      {
        name: 'Verde Pesto Harvest',
        slug: 'verde-pesto-harvest',
        description: 'Ligurian basil pesto base, fresh ricotta dollops, kalamata black olives, sun-dried tomatoes, and toasted pine nuts on gluten-free crust.',
        basePrice: 17.5,
        defaultBase: 'Gluten-Free Cauliflower Crust',
        defaultSauce: 'Ligurian Basil Pesto',
        defaultCheese: 'Fresh Ricotta Dollops',
        defaultVeggies: ['Kalamata Black Olives', 'Sun-Dried Tomatoes'],
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
        tags: ['Gluten-Free', 'Vegetarian'],
        isPopular: true
      }
    ];

    await Pizza.insertMany(signaturePizzas);
    console.log(`[Seed Engine] Seeded ${signaturePizzas.length} signature pizzas.`);

    console.log('\n✅ Database seeding complete. Ready for development & evaluation!');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Engine Error] ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
