import express from 'express';
import { createOrder, verifyPayment, getMyTransactions } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/my/transactions', authenticate, getMyTransactions);

export default router;
