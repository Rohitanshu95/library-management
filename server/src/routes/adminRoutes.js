import express from 'express';
import { getAdminMetrics, getAllTransactions, recordExpense } from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN', 'LIBRARY_OPERATOR', 'CONTENT_MANAGER', 'TEST_MANAGER'));

router.get('/metrics', getAdminMetrics);
router.get('/transactions', getAllTransactions);
router.post('/expenses', recordExpense);

export default router;
