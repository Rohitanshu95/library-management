import express from 'express';
import {
  getAdminMetrics,
  getAllTransactions,
  recordExpense,
  getAllUsers,
  getUserDossier,
  updateUserStatus,
} from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('SUPER_ADMIN', 'LIBRARY_OPERATOR', 'CONTENT_MANAGER', 'TEST_MANAGER'));

// General operational metrics & finances
router.get('/metrics', getAdminMetrics);
router.get('/transactions', getAllTransactions);
router.post('/expenses', recordExpense);

// Comprehensive Aspirants & User Dossier Access (Super Admin exclusive)
router.get('/users', authorizeRoles('SUPER_ADMIN'), getAllUsers);
router.get('/users/:id', authorizeRoles('SUPER_ADMIN'), getUserDossier);
router.put('/users/:id/status', authorizeRoles('SUPER_ADMIN'), updateUserStatus);

export default router;
