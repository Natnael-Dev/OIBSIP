import express from 'express';
import { getAllPizzas, getPizzaBySlug, createPizza } from '../controllers/pizzaController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleGuard.js';

const router = express.Router();

router.get('/', getAllPizzas);
router.get('/:slug', getPizzaBySlug);
router.post('/', protect, requireAdmin, createPizza);

export default router;
