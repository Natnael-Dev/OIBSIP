import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { startCronJobs } from './services/cronService.js';

// Route imports
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import pizzaRoutes from './routes/pizzas.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Initialize real-time WebSocket layer
initSocket(httpServer);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);

// Health Check & Root
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    internshipTrack: 'Web Development & Designing (Level 3)',
    organization: 'Oasis Infobyte'
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(`[Server] Continuing startup. In-memory or fallback mode active.`);
  }

  // Start background automated inventory watcher
  startCronJobs();

  httpServer.listen(PORT, () => {
    console.log(`\n🍕 =================================================`);
    console.log(`🚀 Crust & Craft Backend API Running on Port ${PORT}`);
    console.log(`📡 WebSocket Gateway Attached & Ready`);
    console.log(`⏱️ node-cron Stock Alert Monitor Active`);
    console.log(`💳 Razorpay Test Mode Initialized`);
    console.log(`🍕 =================================================\n`);
  });
};

startServer();

export { app, httpServer };
