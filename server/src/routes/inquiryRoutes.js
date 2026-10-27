import express from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', authenticate, authorizeRoles('SUPER_ADMIN', 'CONTENT_MANAGER', 'LIBRARY_OPERATOR'), getInquiries);
router.put('/:id/status', authenticate, authorizeRoles('SUPER_ADMIN', 'CONTENT_MANAGER', 'LIBRARY_OPERATOR'), updateInquiryStatus);

export default router;
