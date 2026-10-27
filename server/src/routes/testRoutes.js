import express from 'express';
import { getMockTests, startTestAttempt, saveTestProgress, submitTestAttempt, getMyTestHistory } from '../controllers/testController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMockTests);
router.post('/:id/start', authenticate, startTestAttempt);
router.post('/attempt/:attemptId/save-progress', authenticate, saveTestProgress);
router.post('/attempt/:attemptId/submit', authenticate, submitTestAttempt);
router.get('/my/history', authenticate, getMyTestHistory);

export default router;
