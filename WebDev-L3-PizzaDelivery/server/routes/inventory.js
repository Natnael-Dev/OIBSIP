import express from 'express';
import {
  getInventory,
  updateStock,
  updateThreshold,
  triggerManualAudit
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleGuard.js';

const router = express.Router();

router.get('/', getInventory);
router.patch('/:id/stock', protect, requireAdmin, updateStock);
router.patch('/:id/threshold', protect, requireAdmin, updateThreshold);
router.post('/audit-trigger', protect, requireAdmin, triggerManualAudit);
router.post('/audit', protect, requireAdmin, triggerManualAudit);

export default router;
