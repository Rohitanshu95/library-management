import express from 'express';
import { getCourses, getCourseById, getMyEnrolledCourses, updateCourseProgress } from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/my/enrolled', authenticate, getMyEnrolledCourses);
router.get('/:id', getCourseById);
router.post('/:id/progress', authenticate, updateCourseProgress);

export default router;
