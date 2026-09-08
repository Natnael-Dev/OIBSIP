import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crust_and_craft';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection failed: ${error.message}`);
    console.warn('[Database] Retrying or operating in resilient fallback mode.');
    throw error;
  }
};
