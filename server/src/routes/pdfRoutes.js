import express from 'express';
import { getPdfs, getMyPurchasedPdfs, recordPdfDownload } from '../controllers/pdfController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPdfs);
router.get('/my/purchased', authenticate, getMyPurchasedPdfs);
router.post('/:id/download', authenticate, recordPdfDownload);

export default router;
