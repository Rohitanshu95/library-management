import { Course, CourseEnrollment } from '../models/Course.js';

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'ALL') {
      filter.examCategory = category;
    }

    const courses = await Course.find(filter);
    return res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course details with lesson outline
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student's Enrolled Courses & Progress
// @route   GET /api/courses/my/enrolled
// @access  Private (Student)
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    return res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson progress
// @route   POST /api/courses/:id/progress
// @access  Private (Student)
export const updateCourseProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.id;

    let enrollment = await CourseEnrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course.',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      enrollment.lastWatchedLesson = lessonId;
    }

    const totalLessons = course.lessons?.length || 1;
    enrollment.progressPercent = Math.min(
      100,
      Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    );

    await enrollment.save();

    return res.status(200).json({
      success: true,
      progressPercent: enrollment.progressPercent,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
