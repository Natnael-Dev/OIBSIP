import express from 'express';
import {
  createCheckoutOrder,
  verifyPayment,
  getOrderTracking,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleGuard.js';

const router = express.Router();

router.post('/checkout', protect, createCheckoutOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/track/:orderNumber', getOrderTracking);

// Admin Order Management
router.get('/admin/all', protect, requireAdmin, getAllOrdersAdmin);
router.patch('/admin/:id/status', protect, requireAdmin, updateOrderStatusAdmin);

export default router;
