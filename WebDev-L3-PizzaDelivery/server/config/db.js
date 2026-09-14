import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crust_and_craft';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      autoIndex: true
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Local MongoDB service unavailable. Activating In-Memory MongoDB Engine...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Initialized: ${memUri}`);

      const { seedTestDB } = await import('../tests/testHelper.js');
      await seedTestDB();
      console.log(`[Database] Auto-seeded 5 bases, 5 sauces, cheeses, veggies, pizzas & accounts.`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] Fallback engine error: ${memErr.message}`);
      throw memErr;
    }
  }
};
