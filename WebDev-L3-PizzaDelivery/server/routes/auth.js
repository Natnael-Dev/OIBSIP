import express from 'express';
import {
  register,
  verifyEmail,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;
