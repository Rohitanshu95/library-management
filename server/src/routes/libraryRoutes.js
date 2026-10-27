import express from 'express';
import { getLibraryPlans, getMyLibrarySubscription, verifyTicketAndCheckIn } from '../controllers/libraryController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', getLibraryPlans);
router.get('/my-subscription', authenticate, getMyLibrarySubscription);
router.post('/verify-ticket', authenticate, authorizeRoles('SUPER_ADMIN', 'LIBRARY_OPERATOR'), verifyTicketAndCheckIn);

export default router;
